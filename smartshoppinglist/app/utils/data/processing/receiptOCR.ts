import Tesseract from 'tesseract.js'
import { ReceiptData, ReceiptItem } from '../../../types'
import { categorizeItem } from '../suggestions/smartSuggestions'
import { logger } from '../../core/helpers'

export class ReceiptOCR {
  private static readonly HEBREW_STORE_PATTERNS = {
    'רמי לוי': ['רמי לוי', 'RAMI LEVY', 'ר.לוי', 'רמילוי'],
    'שופרסל': ['שופרסל', 'SHUFERSAL', 'ש.סל', 'שופרסאל'],
    'יוחננוף': ['יוחננוף', 'YOCHANANOF', 'יח"נוף', 'יוחננף'],
    'מגה': ['מגא', 'MEGA', 'מגה בור', 'מגה בעיר'],
    'טיב טעם': ['טיב טעם', 'TIV TAAM', 'ט.ט', 'טיבטעם'],
    'אושר עד': ['אושר עד', 'OSHER AD', 'א.ע', 'אושרעד'],
    'קופיקס': ['קופיקס', 'COFIX', 'קופקס'],
    'אלונית': ['אלונית', 'ALONIT'],
    'ויקטורי': ['ויקטורי', 'VICTORY'],
    'מחסני השוק': ['מחסני השוק', 'MAHSANEI HASHUK', 'מחסני'],
    'האחים יעקובי': ['האחים יעקובי', 'יעקובי', 'אחים יעקובי']
  }

  // דפוסי מחירים בעברית
  private static readonly PRICE_PATTERNS = [
    /(\d+\.\d{2})[\s₪שח]*$/gm,        // 12.50 בסוף שורה
    /(\d+,\d{2})[\s₪שח]*$/gm,         // 12,50 בסוף שורה  
    /(\d+\.?\d*)\s*[₪שח]/gm,          // 12.50₪ או 12שח
    /[₪שח]\s*(\d+\.?\d*)/gm,          // ₪12.50
    /(\d{1,3}\.\d{2})\s/gm,           // 12.50 עם רווח
    /(\d{1,3},\d{2})\s/gm,            // 12,50 עם רווח
    /\s(\d{1,3}[.,]\d{2})\s/gm,       // מחיר עם רווחים
    /סכום\s*[:=]?\s*(\d+[.,]\d{2})/gm, // סכום: 12.50
    /מחיר\s*[:=]?\s*(\d+[.,]\d{2})/gm  // מחיר: 12.50
  ]

  // דפוסי סה"כ בעברית
  private static readonly TOTAL_PATTERNS = [
    /(?:סה"כ|סהכ|סך הכל|total|סיכום|לתשלום|לשלם)\s*[:=]?\s*(\d+[.,]\d{2})/gmi,
    /(?:₪|שח)\s*(\d+[.,]\d{2})\s*(?:סה"כ|total|לתשלום)/gmi,
    /לחיוב\s*[:=]?\s*(\d+[.,]\d{2})/gmi
  ]

  // דפוסי כמות בעברית
  private static readonly QUANTITY_PATTERNS = [
    /(\d+)\s*[xX×]\s*/g,
    /כמות\s*[:=]\s*(\d+)/gi,
    /(\d+)\s*יח/g,
    /(\d+)\s*יחידות/g,
    /(\d+)\s*קג/g,
    /(\d+)\s*ליטר/g
  ]

  /**
   * עיבוד תמונת קבלה עם OCR מותאם לעברית
   */
  public static async processReceiptImage(file: File): Promise<ReceiptData> {
    try {
      logger.info('🔍 מתחיל עיבוד קבלה:', file.name)
      
      // בדיקות קובץ
      await this.validateFile(file)
      
      // OCR עם הגדרות מותאמות לעברית
      const ocrText = await this.performOCR(file)
      
      // עיבוד הטקסט
      const receiptData = this.parseHebrewReceiptText(ocrText)
      
      logger.info('✅ קבלה עובדה בהצלחה:', receiptData)
      return receiptData
      
    } catch (error) {
      logger.error('❌ שגיאה בעיבוד הקבלה:', error)
      throw new Error(`שגיאה בעיבוד הקבלה: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  /**
   * בדיקת תקינות הקובץ
   */
  private static async validateFile(file: File): Promise<void> {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('הקובץ גדול מדי. מקסימום 10MB')
    }
    
    if (!file.type.startsWith('image/')) {
      throw new Error('יש להעלות קובץ תמונה בלבד')
    }
  }

  /**
   * ביצוע OCR עם הגדרות מותאמות
   */
  private static async performOCR(file: File): Promise<string> {
    const imageUrl = URL.createObjectURL(file)
    
    try {
      logger.info('📸 מבצע OCR...')
      
      const { data } = await Tesseract.recognize(imageUrl, 'heb+eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            logger.info(`📊 התקדמות OCR: ${Math.round(m.progress * 100)}%`)
          }
        }
      })
      
      logger.info('📄 טקסט שזוהה:', data.text.substring(0, 200) + '...')
      
      if (data.text.length < 20) {
        throw new Error('הטקסט שזוהה קצר מדי. נסה תמונה איכותית יותר')
      }
      
      return data.text
      
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  /**
   * עיבוד טקסט קבלה בעברית
   */
  private static parseHebrewReceiptText(text: string): ReceiptData {
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    logger.info('📋 מעבד שורות:', lines.length)
    
    return {
      storeName: this.detectHebrewStoreName(lines),
      items: this.extractHebrewItems(lines),
      totalAmount: this.extractTotalAmount(text),
      date: new Date()
    }
  }

  /**
   * זיהוי שם חנות בעברית
   */
  private static detectHebrewStoreName(lines: string[]): string {
    for (const line of lines.slice(0, 8)) {
      const cleanLine = line.toLowerCase().replace(/[^\u0590-\u05ff\w\s]/g, '')
      
      for (const [storeName, patterns] of Object.entries(this.HEBREW_STORE_PATTERNS)) {
        for (const pattern of patterns) {
          if (cleanLine.includes(pattern.toLowerCase())) {
            logger.info('🏪 זוהתה חנות:', storeName)
            return storeName
          }
        }
      }
    }
    
    return 'חנות לא מזוהה'
  }

  /**
   * חילוץ פריטים מטקסט עברי
   */
  private static extractHebrewItems(lines: string[]): ReceiptItem[] {
    const items: ReceiptItem[] = []
    const processedNames = new Set<string>()
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // דלג על שורות לא רלוונטיות
      if (this.shouldSkipLine(line)) {
        continue
      }
      
      const item = this.parseHebrewItemLine(line, lines[i + 1] || '')
      
      if (item && !processedNames.has(item.name.toLowerCase())) {
        items.push(item)
        processedNames.add(item.name.toLowerCase())
        logger.info(`🛒 נמצא פריט: ${item.name} - ${item.price} ₪`)
      }
    }
    
    // אם לא נמצאו פריטים, נסה גישה אגרסיבית
    if (items.length === 0) {
      logger.info('🔄 לא נמצאו פריטים, מנסה גישה אגרסיבית...')
      return this.extractItemsAggressive(lines)
    }
    
    logger.info(`✅ נמצאו ${items.length} פריטים`)
    return items
  }

  /**
   * עיבוד שורה של פריט בעברית
   */
  private static parseHebrewItemLine(line: string, nextLine: string): ReceiptItem | null {
    // חפש מחיר
    const price = this.extractPrice(line) || this.extractPrice(nextLine)
    if (!price || price > 500) return null
    
    // נקה את השם מהמחיר
    let itemName = line
    
    // הסר מחירים
    this.PRICE_PATTERNS.forEach(pattern => {
      itemName = itemName.replace(pattern, ' ')
    })
    
    // הסר כמויות
    this.QUANTITY_PATTERNS.forEach(pattern => {
      itemName = itemName.replace(pattern, ' ')
    })
    
    // נקה רווחים כפולים ותווים מיוחדים
    itemName = itemName
      .replace(/\s+/g, ' ')
      .replace(/^[^\u0590-\u05ff\w]+|[^\u0590-\u05ff\w]+$/g, '')
      .trim()
    
    // בדוק תקינות השם
    if (itemName.length < 2 || /^\d+$/.test(itemName)) {
      return null
    }
    
    return {
      name: itemName,
      price,
      quantity: this.extractQuantity(line) || 1,
      category: categorizeItem(itemName)
    }
  }

  /**
   * חילוץ מחיר מטקסט
   */
  private static extractPrice(text: string): number | null {
    for (const pattern of this.PRICE_PATTERNS) {
      pattern.lastIndex = 0
      const match = pattern.exec(text)
      
      if (match) {
        const priceStr = match[1].replace(',', '.')
        const price = parseFloat(priceStr)
        
        if (!isNaN(price) && price >= 0.1 && price <= 500) {
          return price
        }
      }
    }
    
    return null
  }

  /**
   * חילוץ כמות
   */
  private static extractQuantity(text: string): number | null {
    for (const pattern of this.QUANTITY_PATTERNS) {
      const match = pattern.exec(text)
      if (match) {
        const qty = parseInt(match[1])
        if (!isNaN(qty) && qty > 0 && qty <= 20) {
          return qty
        }
      }
    }
    return null
  }

  /**
   * חילוץ סכום כולל
   */
  private static extractTotalAmount(text: string): number {
    for (const pattern of this.TOTAL_PATTERNS) {
      const match = pattern.exec(text)
      if (match) {
        const amount = parseFloat(match[1].replace(',', '.'))
        if (!isNaN(amount) && amount > 0) {
          logger.info(`💰 נמצא סכום כולל: ${amount} ₪`)
          return amount
        }
      }
    }
    
    logger.info('⚠️ לא נמצא סכום כולל')
    return 0
  }

  /**
   * בדיקה האם לדלג על שורה
   */
  private static shouldSkipLine(line: string): boolean {
    const skipPatterns = [
      /^[\d\s\-_=*]{4,}$/,              // רק מספרים וסימנים
      /^[₪שח\d\s\.,]{4,}$/,             // רק מחירים
      /^\s*$/,                          // שורות ריקות
      /^[\*\-_=]{5,}$/,                 // קווים מפרידים
      /^(תאריך|date|time|שעה)/gi,       // תאריכים
      /^מס['\s]*עסק|^עוסק/gi,           // מספר עוסק
      /^ח['\.]?פ['\.]?/gi,              // חשבונית פיסקלית
      /^(קופה|קופאי|מכירה)/gi,          // מידע קופה
      /^(ברקוד|barcode)/gi,             // ברקודים
      /אסמכתא|קבלה|receipt/gi           // מילות מפתח
    ]
    
    return skipPatterns.some(pattern => pattern.test(line))
  }

  /**
   * חילוץ פריטים בגישה אגרסיבית
   */
  private static extractItemsAggressive(lines: string[]): ReceiptItem[] {
    const items: ReceiptItem[] = []
    
    for (const line of lines) {
      if (line.length < 3) continue
      
      // חפש כל מספר שנראה כמו מחיר
      const priceMatches = line.match(/\d+[.,]\d{1,2}/g) || []
      
      for (const priceMatch of priceMatches) {
        const price = parseFloat(priceMatch.replace(',', '.'))
        
        if (price >= 1 && price <= 200) {
          let itemName = line.replace(priceMatch, '').trim()
          itemName = itemName.replace(/[₪שח\d\.,\s]+/g, ' ').trim()
          itemName = itemName.replace(/\s+/g, ' ').trim()
          
          if (itemName.length >= 2) {
            items.push({
              name: itemName,
              price,
              quantity: 1,
              category: categorizeItem(itemName)
            })
            break
          }
        }
      }
    }
    
    return items
  }

  /**
   * חילוץ טקסט גולמי (לדיבוג)
   */
  public static async extractRawText(file: File): Promise<string> {
    const imageUrl = URL.createObjectURL(file)
    
    try {
      const { data } = await Tesseract.recognize(imageUrl, 'heb+eng')
      return data.text
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }
}
