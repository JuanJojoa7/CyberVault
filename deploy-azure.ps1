# Script de PowerShell para desplegar SonarQube en Azure VM
Write-Host "=== Desplegando SonarQube en Azure VM ===" -ForegroundColor Green
Write-Host "IP de VM: 172.177.237.92" -ForegroundColor Yellow

# Verificar que Ansible está instalado
try {
    ansible --version | Out-Null
    Write-Host "✅ Ansible encontrado" -ForegroundColor Green
} 
catch {
    Write-Host "❌ Ansible no encontrado. Instalando..." -ForegroundColor Red
    
    # Instalar Ansible en Windows
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install ansible
    } 
    else {
        Write-Host "Instala Chocolatey primero: https://chocolatey.org/install" -ForegroundColor Red
        Write-Host "O usa WSL/Docker para ejecutar Ansible" -ForegroundColor Yellow
        exit 1
    }
}

# Verificar conectividad
Write-Host "🔍 Verificando conectividad con Azure VM..." -ForegroundColor Yellow
$result = ansible all -i ansible/inventory.ini -m ping 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Conectividad establecida con Azure VM" -ForegroundColor Green
    
    # Desplegar SonarQube
    Write-Host "🚀 Desplegando SonarQube..." -ForegroundColor Yellow
    ansible-playbook -i ansible/inventory.ini ansible/deploy-sonarqube.yml
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SonarQube desplegado exitosamente" -ForegroundColor Green
        
        # Configurar proyecto
        Write-Host "⚙️ Configurando proyecto..." -ForegroundColor Yellow
        ansible-playbook -i ansible/inventory.ini ansible/configure-sonarqube.yml
        
        Write-Host "" 
        Write-Host "🎉 ¡Despliegue completo!" -ForegroundColor Green
        Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
        Write-Host "1. Accede a: http://172.177.237.92:9000" -ForegroundColor White
        Write-Host "2. Login: admin / admin" -ForegroundColor White
        Write-Host "3. Cambia la contraseña" -ForegroundColor White
        Write-Host "4. Crea proyecto con key: cybervault" -ForegroundColor White
        Write-Host "5. Genera token para GitHub" -ForegroundColor White
        Write-Host ""
        Write-Host "GitHub Secrets a configurar:" -ForegroundColor Yellow
        Write-Host "SONAR_HOST_URL: http://172.177.237.92:9000" -ForegroundColor White
        Write-Host "SONAR_TOKEN: [token generado en SonarQube]" -ForegroundColor White
    } 
    else {
        Write-Host "❌ Error en el despliegue" -ForegroundColor Red
    }
} 
else {
    Write-Host "❌ No se puede conectar con la VM. Verifica:" -ForegroundColor Red
    Write-Host "   • Credenciales SSH" -ForegroundColor White
    Write-Host "   • Que la VM esté encendida" -ForegroundColor White
    Write-Host "   • Puertos abiertos en Azure (SSH 22, SonarQube 9000)" -ForegroundColor White
    Write-Host ""
    Write-Host "Error de conexión:" -ForegroundColor Red
    Write-Host $result -ForegroundColor White
}