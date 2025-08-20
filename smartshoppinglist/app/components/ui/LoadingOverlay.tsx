import { LoadingOverlayProps } from '../../types'

export function LoadingOverlay({ message = "טוען..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center">
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <div className="w-12 h-12 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🛒</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {message}
        </h3>
        <p className="text-gray-600 text-sm">
          אנא המתן רגע...
        </p>
      </div>
    </div>
  )
}
