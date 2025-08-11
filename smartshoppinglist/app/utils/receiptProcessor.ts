import Tesseract from 'tesseract.js'
import { ReceiptData, ReceiptItem } from '../types'
import { detectCategory } from './categories'

export class ReceiptProcessor {
  private static readonly STORE_PATTERNS = {
    'רמי לוי': ['רמי לוי', 'RAMI LEVY', 'ר.לוי'],
    'שופרסל': ['שופרסל', 'SHUFERSAL', 'ש.סל'],
    'יוחננוף': ['יוחננוף', 'YOCHANANOF', 'יח"נוף'],
    'מגה': ['מגה', 'MEGA', 'מגה בור'],
    'טיב טעם': ['טיב טעם', 'TIV TAAM', 'ט.ט'],
    'אושר עד': ['אושר עד', 'OSHER AD', 'א.ע'],
    'קופיקס': ['קופיקס', 'COFIX'],
    'אלונית': ['אלונית', 'ALONIT'],
    'ויקטורי': ['ויקטורי', 'VICTORY'],
    'מחסני השוק': ['מחסני השוק', 'MAHSANEI HASHUK']
  }

  private static readonly PRICE_PATTERNS = [
    /(\d+\.\d{2})[\s₪]*$/g,       // 12.50 בסוף שורה עם או בלי ₪
    /(\d+,\d{2})[\s₪]*$/g,        // 12,50 בסוף שורה עם או בלי ₪
    /(\d+\.?\d*)\s*₪/g,           // 12.50₪ או 12₪
    /₪\s*(\d+\.?\d*)/g,           // ₪12.50
    /(\d{1,3}\.\d{2})\s/g,        // 12.50 עם רווח
    /(\d{1,3},\d{2})\s/g,         // 12,50 עם רווח
    /\s(\d{1,3}[.,]\d{2})\s/g,    // מחיר עם רווחים משני הצדדים
    /(\d{1,2})\s*[.,]\s*(\d{2})/g // 12 . 50 או 12 , 50
  ]

  private static readonly QUANTITY_PATTERNS = [
    /(\d+)\s*[xX×]\s*/g,          // 2x, 3X, 4×
    /כמות\s*[:=]\s*(\d+)/gi,      // כמות: 2
    /(\d+)\s*יח/g,                // 2 יח
    /(\d+)\s*יחידות/g             // 2 יחידות
  ]

  private static readonly TOTAL_PATTERNS = [
    /(?:סה"כ|סהכ|סך הכל|total|סיכום)\s*[:=]?\s*(\d+\.?\d*)/gi,
    /(?:לתשלום|לשלם|לחיוב)\s*[:=]?\s*(\d+\.?\d*)/gi,
    /₪\s*(\d+\.?\d*)\s*(?:סה"כ|total)/gi
  ]

  private static readonly ITEM_FILTER_PATTERNS = [
    /^[\d\s\-_=*]{4,}$/,          // רק מספרים וסימנים (4+ תווים)
    /^[₪\d\s\.\,]{4,}$/,          // רק מחירים (4+ תווים)
    /^\s*$/,                      // שורות ריקות
    /^[\*\-_=]{5,}$/,             // קווים מפרידים ארוכים
    /^(תאריך|date|time|שעה)/gi,   // תאריכים ושעות בהתחלת שורה
    /^מס['\s]*עסק|^עוסק/gi,       // מספר עוסק בהתחלת שורה
    /^ח['\.]?פ['\.]?/gi,          // חשבונית פיסקלית
    /^(קופה|קופאי|מכירה)/gi,      // מידע על הקופה בהתחלת שורה
    /^(ברקוד|barcode)/gi,         // ברקודים בהתחלת שורה
    /אסמכתא|קבלה|receipt/gi       // מילות מפתח של קבלות
  ]

  public static async processReceiptImage(file: File): Promise<ReceiptData> {
    try {
      // המרת הקובץ ל-base64 לטסרקט
      const imageData = await this.fileToBase64(file)
      
      console.log('Starting OCR processing for file:', file.name)
      
      // ניסיון ראשון עם עברית ואנגלית
      let ocrResult
      try {
        const { data } = await Tesseract.recognize(imageData, 'heb+eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${(m.progress * 100).toFixed(1)}%`)
            }
          }
        })
        ocrResult = data.text
        console.log('OCR Result (heb+eng):', ocrResult)
      } catch (error) {
        console.warn('Hebrew OCR failed, trying English only:', error)
        // ניסיון שני רק עם אנגלית
        const { data } = await Tesseract.recognize(imageData, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress (eng): ${(m.progress * 100).toFixed(1)}%`)
            }
          }
        })
        ocrResult = data.text
        console.log('OCR Result (eng only):', ocrResult)
      }

      // אם הטקסט קצר מדי, זה כנראה לא עבד
      if (ocrResult.length < 10) {
        throw new Error('הטקסט שזוהה קצר מדי. אנא נסה תמונה איכותית יותר.')
      }
      
      // עיבוד הטקסט שזוהה
      const receiptData = this.parseReceiptText(ocrResult)
      
      // אם לא נמצאו פריטים, נסה עיבוד אגרסיבי יותר
      if (receiptData.items.length === 0) {
        console.log('No items found with standard parsing, trying aggressive parsing...')
        const aggressiveResult = this.parseReceiptTextAggressive(ocrResult)
        if (aggressiveResult.items.length > 0) {
          return aggressiveResult
        }
      }
      
      return receiptData
    } catch (error) {
      console.error('Error processing receipt:', error)
      const errorMessage = error instanceof Error ? error.message : 'שגיאה לא צפויה'
      throw new Error(`שגיאה בעיבוד הקבלה: ${errorMessage}`)
    }
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  private static parseReceiptTextAggressive(text: string): ReceiptData {
    console.log('Starting aggressive parsing...')
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 1)
    
    // זיהוי שם החנות
    const storeName = this.detectStoreName(lines) || 'לא זוהה'
    console.log('Store name (aggressive):', storeName)
    
    const items: ReceiptItem[] = []
    
    // עבור על כל שורה ונסה לחלץ פריטים בצורה אגרסיבית
    for (const line of lines) {
      // דלג על שורות שהן ברור לא פריטים
      if (line.length < 3 || 
          /^[\d\s\-_=*]{4,}$/.test(line) ||
          /^(תאריך|date|time|שעה|קופה|אסמכתא)/gi.test(line)) {
        continue
      }
      
      // חפש כל מספר שנראה כמו מחיר
      const priceMatches = line.match(/\d+[.,]\d{1,2}/g) || line.match(/\d+/g) || []
      
      for (const priceMatch of priceMatches) {
        const price = parseFloat(priceMatch.replace(',', '.'))
        
        // בדוק שזה מחיר סביר (בין 1 ל אלף שקלים)
        if (price >= 1 && price <= 1000) {
          // נסה לחלץ את שם הפריט
          let itemName = line.replace(priceMatch, '').trim()
          itemName = itemName.replace(/[₪\d\.,\s]+/g, ' ').trim()
          itemName = itemName.replace(/\s+/g, ' ').trim()
          
          // נקה תווים מיוחדים מההתחלה והסוף
          itemName = itemName.replace(/^[^\u0590-\u05ff\w]+|[^\u0590-\u05ff\w]+$/g, '')
          
          if (itemName.length >= 2 && !items.find(item => item.name === itemName)) {
            items.push({
              name: itemName,
              price,
              quantity: 1,
              category: detectCategory(itemName)
            })
            console.log('Found aggressive item:', itemName, 'Price:', price)
            break // רק פריט אחד לכל שורה
          }
        }
      }
    }
    
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0)
    
    console.log('Aggressive parsing found', items.length, 'items')
    
    return {
      storeName,
      totalAmount,
      date: new Date(),
      items
    }
  }

  private static parseReceiptText(text: string): ReceiptData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    console.log('Processing lines:', lines) // דיבוג
    
    // זיהוי שם החנות
    const storeName = this.detectStoreName(lines)
    console.log('Detected store:', storeName)
    
    // זיהוי פריטים
    const items = this.detectItems(lines)
    console.log('Detected items:', items)
    
    // זיהוי סכום כולל
    const totalAmount = this.detectTotalAmount(lines) || 
                       items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    console.log('Detected total:', totalAmount)
    
    return {
      storeName,
      totalAmount,
      date: new Date(),
      items
    }
  }

  private static detectStoreName(lines: string[]): string {
    for (const line of lines.slice(0, 10)) { // בדוק את 10 השורות הראשונות
      const normalizedLine = line.toLowerCase().replace(/[^\u0590-\u05ff\w\s]/g, '')
      
      for (const [storeName, patterns] of Object.entries(this.STORE_PATTERNS)) {
        for (const pattern of patterns) {
          if (normalizedLine.includes(pattern.toLowerCase())) {
            return storeName
          }
        }
      }
    }
    return 'לא זוהה'
  }

  private static detectTotalAmount(lines: string[]): number {
    // בדוק את השורות האחרונות לסכום כולל
    const relevantLines = lines.slice(-15)
    
    for (const line of relevantLines.reverse()) {
      for (const pattern of this.TOTAL_PATTERNS) {
        const match = pattern.exec(line)
        if (match) {
          const amount = parseFloat(match[1].replace(',', '.'))
          if (!isNaN(amount) && amount > 0) {
            return amount
          }
        }
      }
    }
    
    // אם לא נמצא סכום כולל, נחשב מסכום כל הפריטים
    return 0
  }

  private static detectItems(lines: string[]): ReceiptItem[] {
    const items: ReceiptItem[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // סנן שורות לא רלוונטיות
      if (this.shouldFilterLine(line)) {
        continue
      }
      
      // נסה לזהות פריט
      const item = this.parseItemLine(line, lines[i + 1] || '')
      if (item) {
        items.push(item)
      }
    }
    
    // אם לא נמצאו פריטים, נסה גישה פחות מגבילה
    if (items.length === 0) {
      console.log('No items found with strict filtering, trying relaxed approach...')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        // רק פילטרים בסיסיים
        if (line.length < 3 || /^[\d\s\-_=*]{5,}$/.test(line)) {
          continue
        }
        
        const item = this.parseItemLineRelaxed(line, lines[i + 1] || '')
        if (item) {
          items.push(item)
        }
      }
    }
    
    return items
  }

  private static parseItemLineRelaxed(line: string, nextLine: string): ReceiptItem | null {
    // גישה פחות מגבילה לזיהוי פריטים
    const priceMatch = this.extractPrice(line) || this.extractPrice(nextLine)
    if (!priceMatch) return null
    
    // נסה לנקות את השם בצורה פשוטה יותר
    let itemName = line.replace(/[\d\.₪,\s]+$/g, '').trim()
    itemName = itemName.replace(/^[\d\.\s]+/, '').trim()
    
    if (itemName.length < 2) return null
    
    return {
      name: itemName,
      price: priceMatch,
      quantity: this.extractQuantity(line) || 1,
      category: detectCategory(itemName)
    }
  }

  private static shouldFilterLine(line: string): boolean {
    return this.ITEM_FILTER_PATTERNS.some(pattern => pattern.test(line))
  }

  private static parseItemLine(line: string, nextLine: string): ReceiptItem | null {
    // חפש מחיר בשורה הנוכחית או הבאה
    const price = this.extractPrice(line) || this.extractPrice(nextLine)
    if (!price) return null
    
    // נקה את השורה מהמחיר כדי לקבל את שם הפריט
    let itemName = line
    
    // הסר מחירים מהשורה
    this.PRICE_PATTERNS.forEach(pattern => {
      itemName = itemName.replace(pattern, '').trim()
    })
    
    // הסר כמויות מהשורה
    this.QUANTITY_PATTERNS.forEach(pattern => {
      itemName = itemName.replace(pattern, '').trim()
    })
    
    // נקה תווים מיוחדים בהתחלה וסוף
    itemName = itemName.replace(/^[^\u0590-\u05ff\w]+|[^\u0590-\u05ff\w]+$/g, '').trim()
    
    // בדוק שיש שם פריט תקין
    if (itemName.length < 2 || /^\d+$/.test(itemName)) {
      return null
    }
    
    // זהה כמות
    const quantity = this.extractQuantity(line) || 1
    
    // זהה קטגוריה
    const category = detectCategory(itemName)
    
    return {
      name: itemName,
      price: price / quantity, // מחיר ליחידה
      quantity,
      category
    }
  }

  private static extractPrice(text: string): number | null {
    // נסה את כל הדפוסים
    for (const pattern of this.PRICE_PATTERNS) {
      pattern.lastIndex = 0 // אפס את האינדקס של regex
      const matches = Array.from(text.matchAll(pattern))
      
      for (const match of matches) {
        let priceStr = ''
        
        if (match[1] && match[2]) {
          // מקרה של שני חלקים נפרדים (12 ו-50)
          priceStr = `${match[1]}.${match[2]}`
        } else if (match[1]) {
          // חלק אחד
          priceStr = match[1].replace(',', '.')
        } else {
          continue
        }
        
        const price = parseFloat(priceStr)
        if (!isNaN(price) && price >= 0.1 && price <= 2000) {
          console.log(`Found price: ${price} from text: "${text}"`)
          return price
        }
      }
    }
    
    // אם לא נמצא כלום, נסה גישה פשוטה יותר
    const simpleMatch = text.match(/(\d+[.,]\d{1,2})/g)
    if (simpleMatch) {
      for (const match of simpleMatch) {
        const price = parseFloat(match.replace(',', '.'))
        if (!isNaN(price) && price >= 0.1 && price <= 2000) {
          console.log(`Found simple price: ${price} from text: "${text}"`)
          return price
        }
      }
    }
    
    return null
  }

  private static extractQuantity(text: string): number {
    for (const pattern of this.QUANTITY_PATTERNS) {
      const match = pattern.exec(text)
      if (match) {
        const qty = parseInt(match[1])
        if (!isNaN(qty) && qty > 0 && qty <= 20) { // כמות סבירה
          return qty
        }
      }
    }
    return 1
  }

  // פונקציה לחילוץ טקסט גולמי בלבד (לצרכי דיבוג)
  public static async extractRawText(file: File): Promise<string> {
    try {
      const imageData = await this.fileToBase64(file)
      
      const { data } = await Tesseract.recognize(imageData, 'heb+eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(1)}%`)
          }
        }
      })
      
      return data.text
    } catch (error) {
      console.error('Error extracting raw text:', error)
      throw new Error('שגיאה בחילוץ הטקסט')
    }
  }
}
