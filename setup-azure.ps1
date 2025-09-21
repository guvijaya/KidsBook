# Azure Storage Setup Script for Kids Essays Website
# Run this script to quickly configure your storage account

param(
    [Parameter(Mandatory=$true)]
    [string]$StorageAccountName
)

Write-Host "🔧 Setting up Azure Storage for Kids Essays Website..." -ForegroundColor Cyan

# Update the storage account name in azure-storage.js
$azureStorageFile = "js\azure-storage.js"

if (Test-Path $azureStorageFile) {
    $content = Get-Content $azureStorageFile -Raw
    $newContent = $content -replace "YOUR_ACTUAL_STORAGE_ACCOUNT_NAME", $StorageAccountName
    $newContent | Set-Content $azureStorageFile
    
    Write-Host "✅ Updated storage account name to: $StorageAccountName" -ForegroundColor Green
    Write-Host "📁 File updated: $azureStorageFile" -ForegroundColor Yellow
} else {
    Write-Host "❌ Could not find $azureStorageFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a container named 'essays' in your Azure Storage Account" -ForegroundColor White
Write-Host "2. Set container public access to 'Blob (anonymous read access)'" -ForegroundColor White
Write-Host "3. Upload your markdown files in this structure:" -ForegroundColor White
Write-Host "   essays/" -ForegroundColor Gray
Write-Host "   ├── en/" -ForegroundColor Gray
Write-Host "   │   ├── my-family.md" -ForegroundColor Gray
Write-Host "   │   ├── my-pet.md" -ForegroundColor Gray
Write-Host "   │   └── ..." -ForegroundColor Gray
Write-Host "   ├── es/" -ForegroundColor Gray
Write-Host "   └── ..." -ForegroundColor Gray
Write-Host ""
Write-Host "4. Your blob URLs will be:" -ForegroundColor White
Write-Host "   https://$StorageAccountName.blob.core.windows.net/essays/en/my-family.md" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Test your website at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 Open azure-setup.html for detailed instructions" -ForegroundColor Yellow