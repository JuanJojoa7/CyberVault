# Script simplificado para desplegar SonarQube en Azure VM
Write-Host "=== Desplegando SonarQube en Azure VM ===" -ForegroundColor Green
Write-Host "IP de VM: 172.177.237.92" -ForegroundColor Yellow

# Verificar Ansible
Write-Host "Verificando Ansible..." -ForegroundColor Yellow
$ansibleCheck = Get-Command ansible -ErrorAction SilentlyContinue

if ($ansibleCheck) {
    Write-Host "✅ Ansible encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Ansible no encontrado" -ForegroundColor Red
    Write-Host "Opciones para instalar Ansible:" -ForegroundColor Yellow
    Write-Host "1. WSL: wsl --install, luego apt install ansible" -ForegroundColor White
    Write-Host "2. Docker: docker run --rm -it -v ${PWD}:/ansible ansible/ansible-runner" -ForegroundColor White
    Write-Host "3. Chocolatey: choco install ansible" -ForegroundColor White
    exit 1
}

# Probar conectividad
Write-Host "🔍 Probando conectividad con Azure VM..." -ForegroundColor Yellow
ansible all -i ansible/inventory.ini -m ping

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Conectividad OK" -ForegroundColor Green
    
    Write-Host "🚀 Desplegando SonarQube..." -ForegroundColor Yellow
    ansible-playbook -i ansible/inventory.ini ansible/deploy-sonarqube.yml
    
    Write-Host "⚙️ Configurando proyecto..." -ForegroundColor Yellow  
    ansible-playbook -i ansible/inventory.ini ansible/configure-sonarqube.yml
    
    Write-Host ""
    Write-Host "🎉 Proceso completado!" -ForegroundColor Green
    Write-Host "Accede a: http://172.177.237.92:9000" -ForegroundColor Yellow
    Write-Host "Usuario: admin | Contraseña: admin" -ForegroundColor White
} else {
    Write-Host "❌ Error de conectividad. Opciones:" -ForegroundColor Red
    Write-Host "1. Configurar manual por SSH" -ForegroundColor White
    Write-Host "2. Verificar credenciales SSH" -ForegroundColor White
    Write-Host "3. Abrir puertos en Azure (22, 9000)" -ForegroundColor White
}