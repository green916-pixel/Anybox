# AnyBox - Deploy to GitHub Script
# Save as: deploy-to-github.ps1
# Usage: Run in PowerShell

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   AnyBox - Deploy to GitHub" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking for git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found. Download from: https://git-scm.com/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Get GitHub username
$username = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter repository name (default: anybox)"

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "anybox"
}

$gitUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "Deploying to: $gitUrl" -ForegroundColor Cyan
Write-Host ""

# Initialize git
Write-Host "Initializing git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMsg = Read-Host "Enter commit message (default: Initial commit)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Initial commit - AnyBox video player"
}
git commit -m $commitMsg

# Set remote
Write-Host "Setting remote repository..." -ForegroundColor Yellow
git remote add origin $gitUrl

# Branch
Write-Host "Setting up main branch..." -ForegroundColor Yellow
git branch -M main

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may need to authenticate with GitHub..." -ForegroundColor Cyan
Write-Host ""

git push -u origin main

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "   ✓ Successfully deployed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now at:" -ForegroundColor Cyan
Write-Host "   $gitUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "View on GitHub:" -ForegroundColor Cyan
Write-Host "   https://github.com/$username/$repoName" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Deploy to Vercel: https://vercel.com" -ForegroundColor White
Write-Host "   2. OR Deploy to Netlify: https://netlify.com" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
