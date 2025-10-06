# CyberVault - CI/CD with SonarQube and Trivy

#Juan Sebastian Gonzalez
#Oscar Gomez
#Juan Felipe Jojoa Crespo
#Juan Manuel Marin Angarita

## Descripción
Proyecto de tienda en línea con integración completa de CI/CD, análisis de calidad de código con SonarQube y análisis de seguridad con Trivy.

## 🚀 Quick Start

### Prerrequisitos
- Node.js 18+
- Docker y Docker Compose
- Git

### Instalación Local
```bash
# Clonar el repositorio
git clone <repo-url>
cd CyberVault

# Instalar dependencias
npm install

# Ejecutar tests con coverage
npm run test:coverage

# Levantar SonarQube local
docker-compose up -d

# Ejecutar la aplicación
npm run dev
```

## 🛠️ Configuración CI/CD

### GitHub Secrets Requeridos
Para que el pipeline funcione correctamente, configura estos secrets en tu repositorio de GitHub:

1. **SONAR_TOKEN**: Token de análisis generado en SonarQube
2. **SONAR_HOST_URL**: URL de tu servidor SonarQube (ej: `http://your-vm-ip:9000`)
3. **CODECOV_TOKEN**: (Opcional) Token para reportes de coverage

### Configuración SonarQube

1. **Acceder a SonarQube**: `http://localhost:9000` (usuario: admin, contraseña: admin)
2. **Crear Proyecto**: Project key: `cybervault`, Display name: `CyberVault`
3. **Generar Token**: Administration → Security → Users → Tokens

## 🔒 Análisis de Seguridad con Trivy

El pipeline ejecuta automáticamente análisis de vulnerabilidades en dependencias y filesystem.

## 📊 Coverage: Actualmente ~6.66% (> 0% requerido)

## 🔄 Pipeline: Se ejecuta en cada push automáticamente

## 📝 Scripts Disponibles

```bash
npm start                # Iniciar aplicación
npm run dev             # Modo desarrollo
npm run test:coverage   # Tests con coverage
npm run sonar          # Análisis SonarQube local
npm run security:scan  # Análisis de seguridad
```