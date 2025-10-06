# Trivy Security Scanning Script
# Este script ejecuta análisis de vulnerabilidades con Trivy

Write-Host "=== Trivy Security Analysis ==="

# Crear directorio para reportes
if (!(Test-Path "security-reports")) {
    New-Item -ItemType Directory -Path "security-reports"
}

Write-Host "1. Scanning filesystem for vulnerabilities..."
trivy fs . --format json --output security-reports/trivy-fs-report.json

Write-Host "2. Scanning package.json for dependency vulnerabilities..."
trivy fs package.json --format table --output security-reports/trivy-deps-report.txt

Write-Host "3. Generating SARIF report for GitHub Security tab..."
trivy fs . --format sarif --output security-reports/trivy-sarif-report.sarif

Write-Host "=== Security Analysis Complete ==="
Write-Host "Reports generated in security-reports/ directory"