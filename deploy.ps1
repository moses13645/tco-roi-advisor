# Script de déploiement pour TCO-ROI Advisor
# Ce script reproduit les étapes nécessaires pour déployer l'application

Write-Host "=== Déploiement de TCO-ROI Advisor ===" -ForegroundColor Green

# Étape 1: Vérifier que nous sommes dans le bon répertoire
$currentDir = Get-Location
$expectedDir = "tco-roi-advisor-main"

if ($currentDir.Path -notlike "*$expectedDir") {
    Write-Host "Navigation vers le répertoire du projet..." -ForegroundColor Yellow
    if (Test-Path $expectedDir) {
        Set-Location $expectedDir
        Write-Host "Répertoire changé vers: $(Get-Location)" -ForegroundColor Green
    } else {
        Write-Host "Erreur: Répertoire '$expectedDir' introuvable!" -ForegroundColor Red
        exit 1
    }
}

# Étape 2: Installer les dépendances
Write-Host "`n=== Installation des dépendances ===" -ForegroundColor Green
Write-Host "Exécution de: npm install --force" -ForegroundColor Yellow

try {
    npm install --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dépendances installées avec succès" -ForegroundColor Green
    } else {
        Write-Host "✗ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Erreur lors de l'installation: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Étape 3: Builder l'application pour la production
Write-Host "`n=== Build de l'application ===" -ForegroundColor Green
Write-Host "Exécution de: npm run build" -ForegroundColor Yellow

try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Application buildée avec succès" -ForegroundColor Green
    } else {
        Write-Host "✗ Erreur lors du build" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Erreur lors du build: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Étape 4: Vérifier que le dossier dist existe
Write-Host "`n=== Vérification du build ===" -ForegroundColor Green
if (Test-Path "dist") {
    Write-Host "✓ Dossier 'dist' créé avec succès" -ForegroundColor Green
    $distContents = Get-ChildItem "dist" | Select-Object Name
    Write-Host "Contenu du dossier dist:" -ForegroundColor Cyan
    $distContents | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
} else {
    Write-Host "✗ Dossier 'dist' introuvable après le build" -ForegroundColor Red
    exit 1
}

# Étape 5: Test du build (optionnel)
Write-Host "`n=== Test du build (optionnel) ===" -ForegroundColor Green
Write-Host "Pour tester le build localement, exécutez: npm run preview" -ForegroundColor Yellow
Write-Host "Cela démarrera un serveur local sur le port 4173" -ForegroundColor Gray

Write-Host "`n=== Déploiement terminé avec succès! ===" -ForegroundColor Green
Write-Host "Les fichiers de production sont dans le dossier 'dist'" -ForegroundColor Cyan
Write-Host "Vous pouvez maintenant déployer le contenu du dossier 'dist' sur votre serveur web." -ForegroundColor Cyan

# Instructions pour différents types de déploiement
Write-Host "`n=== Instructions de déploiement ===" -ForegroundColor Yellow
Write-Host "1. Serveur web statique (Apache, Nginx): Copiez le contenu de 'dist' vers votre répertoire web"
Write-Host "2. Netlify/Vercel: Connectez ce dépôt et déployez automatiquement"
Write-Host "3. GitHub Pages: Utilisez une action GitHub pour déployer le dossier 'dist'"
Write-Host "4. Docker: Créez une image Nginx servant les fichiers statiques"