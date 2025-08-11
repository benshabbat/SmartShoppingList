import { ShoppingCart } from 'lucide-react'

export const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          רשימת קניות חכמה
        </h1>
      </div>
      <p className="text-gray-600 text-lg">הוסף לסל ← קנה ← תוקף</p>
      <div className="mt-4 flex justify-center">
        <div className="bg-white rounded-full px-4 py-2 shadow-md border">
          <span className="text-sm text-gray-500">מותאם אישית עבורך</span>
        </div>
      </div>
    </div>
  )
}
