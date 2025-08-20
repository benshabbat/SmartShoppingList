import Tesseract from 'tesseract.js'
import { ReceiptData, ReceiptItem } from '../../../types'
import { detectCategory } from '../categories/categories'
import { logger } from '../../core/helpers'

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
      
      logger.info('Starting OCR processing for file:', file.name)
      
      // ניסיון ראשון עם עברית ואנגלית
      let ocrResult
      try {
        const { data } = await Tesseract.recognize(imageData, 'heb+eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              logger.info(`OCR Progress: ${(m.progress * 100).toFixed(1)}%`)
            }
          }
        })
        ocrResult = data.text
        logger.info('OCR Result (heb+eng):', ocrResult)
      } catch (error) {
        logger.warn('Hebrew OCR failed, trying English only:', error)
        // ניסיון שני רק עם אנגלית
        const { data } = await Tesseract.recognize(imageData, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              logger.info(`OCR Progress (eng): ${(m.progress * 100).toFixed(1)}%`)
            }
          }
        })
        ocrResult = data.text
        logger.info('OCR Result (eng only):', ocrResult)
      }

      // אם הטקסט קצר מדי, זה כנראה לא עבד
      if (ocrResult.length < 10) {
        throw new Error('הטקסט שזוהה קצר מדי. אנא נסה תמונה איכותית יותר.')
      }
      
      // עיבוד הטקסט שזוהה
      const receiptData = this.parseReceiptText(ocrResult)
      
      // אם לא נמצאו פריטים, נסה עיבוד אגרסיבי יותר
      if (receiptData.items.length === 0) {
        logger.info('No items found with standard parsing, trying aggressive parsing...')
        const aggressiveResult = this.parseReceiptTextAggressive(ocrResult)
        if (aggressiveResult.items.length > 0) {
          return aggressiveResult
        }
      }
      
      return receiptData
    } catch (error) {
      logger.error('Error processing receipt:', error)
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
    logger.info('Starting simplified parsing...')
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 1)
    
    // זיהוי שם החנות - רק בשורות הראשונות
    const storeName = this.detectStoreName(lines.slice(0, 8)) || 'לא זוהה'
    logger.info('Store name:', storeName)
    
    // זיהוי תאריך פשוט
    const receiptDate = this.detectSimpleDate(lines) || new Date()
    logger.info('Receipt date:', receiptDate)
    
    const items: ReceiptItem[] = []
    
    // עבור על כל שורה ונסה לחלץ פריטים - התמקדות בפשטות
    for (const line of lines) {
      // דלג על שורות שהן ברור לא פריטים
      if (line.length < 3 || 
          /^[\d\s\-_=*]{4,}$/.test(line) ||
          /^(תאריך|date|time|שעה|קופה|אסמכתא|ברקוד|מחלקה)/gi.test(line)) {
        continue
      }
      
      // חפש מחיר בשורה
      const price = this.extractPrice(line)
      
      if (price && price >= 1 && price <= 1000) {
        // חלץ שם פריט פשוט
        let itemName = line.replace(/[\d\.,₪\s]+$/g, '').trim() // הסר מחיר מהסוף
        itemName = itemName.replace(/^[\d\s]+/, '').trim() // הסר מספרים מההתחלה
        itemName = itemName.replace(/[^\u0590-\u05ff\w\s]/g, ' ').trim() // הסר תווים מיוחדים
        itemName = itemName.replace(/\s+/g, ' ').trim() // נקה רווחים כפולים
        
        // בדוק שיש שם פריט תקין
        if (itemName.length >= 2 && !items.find(item => item.name === itemName)) {
          items.push({
            name: itemName,
            price,
            quantity: 1
          })
          logger.info(`Found item: ${itemName} Price: ${price}`)
        }
      }
    }
    
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0)
    
    logger.info(`Found ${items.length} items, total: ${totalAmount}`)
    
    return {
      storeName,
      totalAmount,
      date: receiptDate,
      items
    }
  }

  private static parseReceiptText(text: string): ReceiptData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    logger.info(`Processing lines: ${lines.length} lines`)
    
    // זיהוי שם החנות - התמקד בשורות הראשונות
    const storeName = this.detectStoreName(lines.slice(0, 8))
    logger.info('Detected store:', storeName)
    
    // זיהוי תאריך
    const receiptDate = this.detectSimpleDate(lines) || new Date()
    logger.info('Detected date:', receiptDate)
    
    // זיהוי פריטים - פשוט ויעיל
    const items = this.detectItemsSimple(lines)
    logger.info('Detected items:', items.length)
    
    // סכום כולל
    const totalAmount = this.detectTotalAmount(lines) || 
                       items.reduce((sum: number, item: ReceiptItem) => sum + item.price, 0)
    logger.info('Total amount:', totalAmount)
    
    return {
      storeName: storeName || 'לא זוהה',
      totalAmount,
      date: receiptDate,
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

  private static detectItemsSimple(lines: string[]): ReceiptItem[] {
    const items: ReceiptItem[] = []
    
    for (const line of lines) {
      // דלג על שורות לא רלוונטיות
      if (this.shouldFilterLine(line)) {
        continue
      }
      
      // חפש מחיר בשורה
      const price = this.extractPrice(line)
      if (!price || price < 1 || price > 1000) {
        continue
      }
      
      // חלץ שם הפריט בצורה פשוטה
      let itemName = line
      
      // הסר מחירים
      itemName = itemName.replace(/[\d\.,₪]+/g, '').trim()
      
      // נקה תווים מיוחדים
      itemName = itemName.replace(/[^\u0590-\u05ff\w\s]/g, ' ').trim()
      itemName = itemName.replace(/\s+/g, ' ').trim()
      
      // בדוק שיש שם תקין
      if (itemName.length >= 2 && !items.find(item => item.name === itemName)) {
        items.push({
          name: itemName,
          price,
          quantity: 1
        })
        logger.info(`Simple detection - Item: ${itemName} Price: ${price}`)
      }
    }
    
    return items
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
      logger.info('No items found with strict filtering, trying relaxed approach...')
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
          logger.info(`Found price: ${price} from text: "${text}"`)
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
          logger.info(`Found simple price: ${price} from text: "${text}"`)
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

  private static detectSimpleDate(lines: string[]): Date | null {
    // חפש תאריך בפורמטים נפוצים בקבלות ישראליות
    const datePatterns = [
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/g, // 12/08/2025 או 12-08-25
      /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})/g,   // 12/08/25
      /תאריך[:\s]*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/gi
    ]
    
    for (const line of lines.slice(0, 15)) { // בדוק רק 15 השורות הראשונות
      for (const pattern of datePatterns) {
        const match = pattern.exec(line)
        if (match) {
          const day = parseInt(match[1])
          const month = parseInt(match[2])
          let year = parseInt(match[3])
          
          // תקן שנה דו-ספרתית
          if (year < 100) {
            year += year < 50 ? 2000 : 1900
          }
          
          // בדוק שהתאריך סביר
          if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2020 && year <= 2030) {
            logger.info(`Found date: ${day} ${month} ${year}`)
            return new Date(year, month - 1, day)
          }
        }
      }
    }
    
    return null
  }

  // פונקציה לחילוץ טקסט גולמי בלבד (לצרכי דיבוג)
  public static async extractRawText(file: File): Promise<string> {
    try {
      const imageData = await this.fileToBase64(file)
      
      const { data } = await Tesseract.recognize(imageData, 'heb+eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            logger.info(`OCR Progress: ${(m.progress * 100).toFixed(1)}%`)
          }
        }
      })
      
      return data.text
    } catch (error) {
      logger.error('Error extracting raw text:', error)
      throw new Error('שגיאה בחילוץ הטקסט')
    }
  }
}
