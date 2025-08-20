# PowerShell script to fix import paths after component reorganization

$basePath = "c:\Users\bensh\OneDrive\שולחן העבודה\smartShoppingList\smartshoppinglist\app"

# Define comprehensive mapping of old to new paths
$importMappings = @{
    # Components imports
    "from '\.\./components/Toast'" = "from '../components/notifications/Toast'"
    "from '\./Animations'" = "from '../ui/Animations'"
    "from '\./Card'" = "from '../ui/Card'"
    "from '\./ActionButton'" = "from '../ui/ActionButton'"
    "from '\./LoadingOverlay'" = "from '../ui/LoadingOverlay'"
    "from '\./InteractiveEmoji'" = "from '../ui/InteractiveEmoji'"
    "from '\.\./ReceiptScanner'" = "from '../../ui/ReceiptScanner'"
    "from '\.\./ExpiryDateModal'" = "from '../../shopping/ExpiryDateModal'"
    "from '\.\./DataImportModal'" = "from '../../statistics/DataImportModal'"
    "from '\.\./ExpiryNotification'" = "from '../../notifications/ExpiryNotification'"
    "from '\.\./QuickStatsCards'" = "from '../../statistics/QuickStatsCards'"
    "from '\.\./QuickListCreator'" = "from '../../shopping/QuickListCreator'"
    "from '\.\./QuickAddButtons'" = "from '../../shopping/QuickAddButtons'"
    "from '\.\./ShoppingListSections'" = "from '../../shopping/ShoppingListSections'"
    "from '\.\./ShoppingCartSection'" = "from '../../shopping/ShoppingCartSection'"
    "from '\.\./DataExport'" = "from '../../statistics/DataExport'"
    "from '\.\./SmartSuggestions'" = "from '../../shopping/SmartSuggestions'"
    
    # Utils imports - fix the helper imports
    "from '\./helpers'" = "from '../helpers'"
    "from '\.\./utils/dateUtils'" = "from '../../utils/data/dateUtils'"
    "from '\.\./utils/classNames'" = "from '../../utils/ui/classNames'"
    "from '\.\./utils/receiptOCR'" = "from '../../utils/data/receiptOCR'"
    "from '\.\./utils/smartSuggestions'" = "from '../../utils/data/smartSuggestions'"
    "from '\.\./utils/soundManager'" = "from '../../utils/ui/soundManager'"
    "from '\.\./utils/helpers'" = "from '../../utils/helpers'"
    "from '\.\./utils'" = "from '../../utils'"
    
    # Context imports
    "from '\.\./contexts/GlobalShoppingContext'" = "from '../../contexts/GlobalShoppingContext'"
    "from '\.\./contexts'" = "from '../../contexts'"
    
    # Types imports
    "from '\.\./types'" = "from '../../types'"
    "from '\.\./types/components'" = "from '../../types/components'"
    
    # Constants imports
    "from '\.\./constants'" = "from '../../constants'"
    
    # Main app content
    "from '\./components/MainAppContent'" = "from './components/layout/MainAppContent'"
    
    # Hooks imports
    "from '\.\./hooks'" = "from '../../hooks'"
    "from '\.\./hooks/useAuth'" = "from '../../hooks/useAuth'"
    
    # Stores imports
    "from '\.\./stores/data/analyticsStore'" = "from '../../stores/data/analyticsStore'"
    
    # Special case for MainAppContent useMainAppLogic
    "from '\./MainAppContent/useMainAppLogic'" = "from '../layout/MainAppContent/useMainAppLogic'"
}

Write-Host "Starting comprehensive import fixing..." -ForegroundColor Yellow

# Get all TypeScript files
$files = @()
$files += Get-ChildItem -Path "$basePath\components" -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path "$basePath\components" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path "$basePath\utils" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path "$basePath\contexts" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path "$basePath\hooks" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path "$basePath" -Filter "*.tsx" -ErrorAction SilentlyContinue

Write-Host "Found $($files.Count) files to process"

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        foreach ($mapping in $importMappings.GetEnumerator()) {
            $content = $content -replace [regex]::Escape($mapping.Key), $mapping.Value
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  ✓ Updated imports in $($file.Name)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ✗ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Import fixing completed!" -ForegroundColor Yellow
