# Component Generator PowerShell Script
# Creates a new component with separated logic and UI following our pattern
# 
# Usage: .\scripts\create-component.ps1 ComponentName

param(
    [Parameter(Mandatory=$true)]
    [string]$ComponentName
)

if (-not $ComponentName) {
    Write-Host "❌ Please provide a component name" -ForegroundColor Red
    Write-Host "Usage: .\scripts\create-component.ps1 ComponentName"
    exit 1
}

$ComponentDir = Join-Path $PSScriptRoot ".." "app" "components" $ComponentName

# Create component directory
if (-not (Test-Path $ComponentDir)) {
    New-Item -ItemType Directory -Path $ComponentDir -Force | Out-Null
    Write-Host "✅ Created directory: $ComponentDir" -ForegroundColor Green
} else {
    Write-Host "⚠️  Directory already exists: $ComponentDir" -ForegroundColor Yellow
}

# Template for logic hook
$LogicTemplate = @"
import { useState } from 'react'

interface Use${ComponentName}LogicProps {
  // Add your props here
}

/**
 * Custom hook for ${ComponentName} business logic
 * Handles state management, event handlers, and computations
 */
export const use${ComponentName}Logic = ({ 
  // Add props destructuring here
}: Use${ComponentName}LogicProps) => {
  // State management
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Event handlers
  const handleSomething = () => {
    // Add your business logic here
  }

  // Computed values
  // const computedValue = useMemo(() => {
  //   // Add computations here
  // }, [dependencies])

  return {
    // State
    loading,
    error,
    
    // Event handlers
    handleSomething,
    
    // Computed values
    // computedValue,
  }
}
"@

# Template for UI component
$UITemplate = @"
interface ${ComponentName}UIProps {
  // State props
  loading: boolean
  error: string | null
  
  // Event handler props
  onSomething: () => void
  
  // Add more props as needed
}

/**
 * Pure UI component for ${ComponentName}
 * Contains only rendering logic, no business logic
 */
export const ${ComponentName}UI = ({
  loading,
  error,
  onSomething,
}: ${ComponentName}UIProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">${ComponentName}</h2>
      
      {error && (
        <div className="text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={onSomething}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  )
}
"@

# Template for container component
$ContainerTemplate = @"
import { use${ComponentName}Logic } from './use${ComponentName}Logic'
import { ${ComponentName}UI } from './${ComponentName}UI'

interface ${ComponentName}Props {
  // Add your public API props here
}

/**
 * Container component that combines logic and UI
 * Follows the Container/Presentational pattern
 */
export const ${ComponentName} = ({ 
  // Add props destructuring here
}: ${ComponentName}Props) => {
  const logic = use${ComponentName}Logic({
    // Pass props to logic hook
  })

  return (
    <${ComponentName}UI
      loading={logic.loading}
      error={logic.error}
      onSomething={logic.handleSomething}
      // Add more prop mappings as needed
    />
  )
}
"@

# Write files
$Files = @(
    @{ Name = "use${ComponentName}Logic.ts"; Content = $LogicTemplate },
    @{ Name = "${ComponentName}UI.tsx"; Content = $UITemplate },
    @{ Name = "index.tsx"; Content = $ContainerTemplate }
)

foreach ($File in $Files) {
    $FilePath = Join-Path $ComponentDir $File.Name
    $File.Content | Out-File -FilePath $FilePath -Encoding UTF8
    Write-Host "✅ Created: $($File.Name)" -ForegroundColor Green
}

# Update component index.ts
$IndexPath = Join-Path $PSScriptRoot ".." "app" "components" "index.ts"
$IndexContent = Get-Content $IndexPath -Raw

if ($IndexContent -notlike "*export { $ComponentName }*") {
    $NewExport = "`nexport { $ComponentName } from './$ComponentName'"
    Add-Content -Path $IndexPath -Value $NewExport
    Write-Host "✅ Added export to components/index.ts" -ForegroundColor Green
}

Write-Host "`n🎉 Component $ComponentName created successfully!" -ForegroundColor Cyan
Write-Host "`n📁 Files created:" -ForegroundColor Yellow
foreach ($File in $Files) {
    Write-Host "   - $ComponentName/$($File.Name)"
}

Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Implement your business logic in use${ComponentName}Logic.ts"
Write-Host "   2. Design your UI in ${ComponentName}UI.tsx"
Write-Host "   3. Update prop interfaces as needed"
Write-Host "   4. Import and use: import { $ComponentName } from '@/app/components'"
