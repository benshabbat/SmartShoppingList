'use client'

import { StateManagementExample } from '../components/StateManagementExample'

export default function StateManagementTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            🛒 State Management Demo
          </h1>
          <p className="text-center text-gray-600 mb-8">
            This page demonstrates the new TanStack Query + Zustand state management setup
          </p>
          
          <StateManagementExample />
        </div>
      </div>
    </div>
  )
}
