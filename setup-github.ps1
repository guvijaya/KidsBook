# GitHub Configuration Script for Kids Essays Website
# PowerShell version for Windows users

param(
    [string]$GitHubUsername,
    [string]$RepositoryName = "kids-essays",
    [string]$BranchName = "main",
    [string]$ContentPath = "essays"
)

Write-Host "🐙 GitHub Configuration Setup for Kids Essays Website" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if github-content.js exists
if (-not (Test-Path "js\github-content.js")) {
    Write-Host "❌ Error: github-content.js not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the website root directory." -ForegroundColor Red
    exit 1
}

# Get GitHub username if not provided
if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "GitHub Username"
    if (-not $GitHubUsername) {
        Write-Host "❌ GitHub username is required!" -ForegroundColor Red
        exit 1
    }
}

# Get repository name if not provided
if (-not $RepositoryName) {
    $input = Read-Host "Repository Name (default: kids-essays)"
    if ($input) { $RepositoryName = $input }
}

# Get branch name if not provided
if (-not $BranchName) {
    $input = Read-Host "Branch Name (default: main)"
    if ($input) { $BranchName = $input }
}

# Get content path if not provided
if (-not $ContentPath) {
    $input = Read-Host "Content Path (default: essays)"
    if ($input) { $ContentPath = $input }
}

Write-Host ""
Write-Host "🔧 Configuring github-content.js..." -ForegroundColor Yellow

# Create backup
Copy-Item "js\github-content.js" "js\github-content.js.backup"
Write-Host "📋 Backup created: js\github-content.js.backup" -ForegroundColor Green

# Read the current content
$content = Get-Content "js\github-content.js" -Raw

# Update the configuration
$content = $content -replace "this\.githubUsername = 'your-github-username';", "this.githubUsername = '$GitHubUsername';"
$content = $content -replace "this\.repositoryName = 'kids-essays';", "this.repositoryName = '$RepositoryName';"
$content = $content -replace "this\.branch = 'main';", "this.branch = '$BranchName';"
$content = $content -replace "this\.contentPath = 'essays';", "this.contentPath = '$ContentPath';"

# Write the updated content back
Set-Content "js\github-content.js" $content

Write-Host "✅ Configuration updated!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your settings:" -ForegroundColor Cyan
Write-Host "   GitHub Username: $GitHubUsername" -ForegroundColor White
Write-Host "   Repository Name: $RepositoryName" -ForegroundColor White
Write-Host "   Branch: $BranchName" -ForegroundColor White
Write-Host "   Content Path: $ContentPath" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Your repository URL: https://github.com/$GitHubUsername/$RepositoryName" -ForegroundColor Blue
Write-Host "📁 Expected content structure: https://github.com/$GitHubUsername/$RepositoryName/tree/$BranchName/$ContentPath" -ForegroundColor Blue
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Create your GitHub repository if you haven't already" -ForegroundColor White
Write-Host "   2. Add your essay markdown files to the $ContentPath folder" -ForegroundColor White
Write-Host "   3. Test your website to see the content loading from GitHub" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Setup complete! Happy writing! 📚✨" -ForegroundColor Green

# Ask if user wants to open GitHub repository creation page
$openGitHub = Read-Host "Would you like to open GitHub to create your repository? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/new"
}