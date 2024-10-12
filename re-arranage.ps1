# Define the base directory for services
$baseDir = "D:\Repos\CryptIQ-Micro-Frontend\services"

# List of new subdirectories for services
$serviceSubdirs = @("Market-Analysis", "Risk-Management", "Sentiment-Analysis")

# Create subdirectories if they don't exist
foreach ($dir in $serviceSubdirs) {
    $newPath = Join-Path $baseDir $dir
    if (!(Test-Path $newPath)) {
        New-Item -ItemType Directory -Path $newPath
    }
}

# Define mapping of files to subdirectories
$marketAnalysisFiles = @("ai_based_trend_strength_identifier.py", "price_volatility_spike_detector.py")
$riskManagementFiles = @("risk_management.py", "risk_adjusted_trade_sizing.py")
$sentimentAnalysisFiles = @("sentiment_strategy_selector.py", "ai_driven_market_sentiment_anomaly_detector.py")

# Move files to new directories
foreach ($file in $marketAnalysisFiles) {
    Move-Item -Path (Join-Path $baseDir $file) -Destination (Join-Path $baseDir "Market-Analysis")
}

foreach ($file in $riskManagementFiles) {
    Move-Item -Path (Join-Path $baseDir $file) -Destination (Join-Path $baseDir "Risk-Management")
}

foreach ($file in $sentimentAnalysisFiles) {
    Move-Item -Path (Join-Path $baseDir $file) -Destination (Join-Path $baseDir "Sentiment-Analysis")
}

# Convert .js files to .ts (typescript) files
$allJsFiles = Get-ChildItem -Path $baseDir -Recurse -Filter *.js

foreach ($file in $allJsFiles) {
    # Rename file extension from .js to .ts
    Rename-Item -Path $file.FullName -NewName ($file.Name -replace ".js$", ".ts")
}

Write-Host "Directory restructuring and file renaming completed!"
