import { useState } from 'react'
import { X, Download, Upload, AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
import { useGlobalShopping } from '../../contexts/GlobalShoppingContext'

export function DataImportModal() {
  // Get everything from global context - NO PROPS DRILLING!
  const { 
    showDataImportModal, 
    closeDataImportModal,
    // We'll need to add these functions to the global context if they don't exist
  } = useGlobalShopping()
  
  const [importing, setImporting] = useState(false)

  if (!showDataImportModal) return null

  const handleImport = async () => {
    setImporting(true)
    try {
      // TODO: Implement guest data import in global context
      // await importGuestData()
      closeDataImportModal()
    } catch (error) {
      console.error('Error importing data:', error)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            ייבוא נתונים
          </h2>
          <button
            onClick={closeDataImportModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* TODO: Add hasGuestData to global context */}
        {true ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">
                    נתונים מקומיים נמצאו
                  </h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    נמצאו נתונים שנשמרו במצב אורח במכשיר זה. האם ברצונך לייבא אותם לחשבון שלך?
                    זה יכלול רשימות קניות, היסטוריית רכישות ונתוני מזווה.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                💡 <strong>טיפ:</strong> הייבוא יוסיף את הנתונים הקיימים לחשבון שלך מבלי למחוק נתונים קיימים.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    מייבא...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    ייבא נתונים
                  </>
                )}
              </button>
              
              <button
                onClick={closeDataImportModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-300"
              >
                דלג בינתיים
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              כל הכבוד!
            </h3>
            <p className="text-gray-600">
              התחברת בהצלחה לחשבון שלך. כעת תוכל ליהנות מסנכרון בין מכשירים ומתכונות מתקדמות נוספות.
            </p>
            <button
              onClick={closeDataImportModal}
              className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
            >
              המשך
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
