const scanner = require('sonarqube-scanner');

scanner(
    {
        serverUrl: process.env.SONAR_HOST_URL || 'http://localhost:9000',
        token: process.env.SONAR_TOKEN || '',
        options: {
            'sonar.projectKey': 'cybervault',
            'sonar.projectName': 'CyberVault',
            'sonar.projectVersion': '1.0.0',
            'sonar.sources': 'server,client/js',
            'sonar.exclusions': 'node_modules/**,coverage/**,__tests__/**,**/*.test.js,**/*.spec.js',
            'sonar.tests': '__tests__',
            'sonar.test.inclusions': '**/*.test.js,**/*.spec.js',
            'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.coverage.exclusions': '**/*.test.js,**/*.spec.js,node_modules/**',
            'sonar.sourceEncoding': 'UTF-8'
        }
    },
    () => {
        console.log('SonarQube analysis completed');
        process.exit();
    }
);