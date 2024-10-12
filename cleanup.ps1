# Define the base directory for services
$baseDir = "D:\Repos\CryptIQ-Micro-Frontend\services"

# Find and remove all webpack.config.js files in the services directory
$webpackFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "webpack.config.ts"

foreach ($file in $webpackFiles) {
    Remove-Item -Path $file.FullName
    Write-Host "Removed: $($file.FullName)"
}

Write-Host "All webpack.config.js files have been removed!"
