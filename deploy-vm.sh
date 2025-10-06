#!/bin/bash

# Script para ejecutar el despliegue completo de SonarQube en VM

echo "=== SonarQube VM Deployment Script ==="
echo "Este script desplegará SonarQube en tu máquina virtual usando Ansible"
echo

# Verificar que Ansible está instalado
if ! command -v ansible &> /dev/null; then
    echo "❌ Ansible no está instalado. Instalando..."
    
    # Detectar el sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt update
        sudo apt install -y ansible
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install ansible
    else
        echo "Sistema operativo no soportado. Instala Ansible manualmente."
        exit 1
    fi
fi

echo "✅ Ansible está disponible"

# Verificar que el archivo de inventario existe
if [ ! -f "ansible/inventory.ini" ]; then
    echo "❌ Archivo de inventario no encontrado: ansible/inventory.ini"
    echo "Por favor, configura tu VM en el archivo de inventario primero."
    exit 1
fi

echo "✅ Archivo de inventario encontrado"

# Verificar conectividad con la VM
echo "🔍 Verificando conectividad con la VM..."
if ansible all -i ansible/inventory.ini -m ping; then
    echo "✅ Conectividad con VM establecida"
else
    echo "❌ No se puede conectar con la VM. Verifica:"
    echo "   1. La IP de la VM en ansible/inventory.ini"
    echo "   2. Las credenciales SSH"
    echo "   3. Que la VM esté ejecutándose"
    exit 1
fi

# Ejecutar el despliegue
echo "🚀 Desplegando SonarQube en la VM..."
ansible-playbook -i ansible/inventory.ini ansible/deploy-sonarqube.yml

if [ $? -eq 0 ]; then
    echo "✅ SonarQube desplegado exitosamente"
    
    # Configurar el proyecto
    echo "⚙️ Configurando proyecto SonarQube..."
    ansible-playbook -i ansible/inventory.ini ansible/configure-sonarqube.yml
    
    if [ $? -eq 0 ]; then
        echo "🎉 ¡Despliegue completo exitoso!"
        echo
        echo "Próximos pasos:"
        echo "1. Accede a SonarQube en la URL mostrada arriba"
        echo "2. Cambia la contraseña por defecto"
        echo "3. Copia el token generado a los GitHub Secrets"
        echo "4. Haz push a tu repositorio para probar el pipeline"
    else
        echo "⚠️ SonarQube desplegado pero la configuración falló"
        echo "Puedes configurar manualmente desde la interfaz web"
    fi
else
    echo "❌ Error en el despliegue de SonarQube"
    exit 1
fi