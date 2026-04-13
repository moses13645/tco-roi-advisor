#!/bin/bash

# Script de déploiement pour TCO-ROI Advisor
# Ce script reproduit les étapes nécessaires pour déployer l'application

echo "=== Déploiement de TCO-ROI Advisor ==="

# Étape 1: Vérifier que nous sommes dans le bon répertoire
CURRENT_DIR=$(pwd)
EXPECTED_DIR="tco-roi-advisor-main"

if [[ "$CURRENT_DIR" != *"$EXPECTED_DIR" ]]; then
    echo "Navigation vers le répertoire du projet..."
    if [ -d "$EXPECTED_DIR" ]; then
        cd "$EXPECTED_DIR"
        echo "Répertoire changé vers: $(pwd)"
    else
        echo "Erreur: Répertoire '$EXPECTED_DIR' introuvable!"
        exit 1
    fi
fi

# Étape 2: Installer les dépendances
echo ""
echo "=== Installation des dépendances ==="
echo "Exécution de: npm install --force"

if npm install --force; then
    echo "✓ Dépendances installées avec succès"
else
    echo "✗ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Étape 3: Builder l'application pour la production
echo ""
echo "=== Build de l'application ==="
echo "Exécution de: npm run build"

if npm run build; then
    echo "✓ Application buildée avec succès"
else
    echo "✗ Erreur lors du build"
    exit 1
fi

# Étape 4: Vérifier que le dossier dist existe
echo ""
echo "=== Vérification du build ==="
if [ -d "dist" ]; then
    echo "✓ Dossier 'dist' créé avec succès"
    echo "Contenu du dossier dist:"
    ls -la dist/
else
    echo "✗ Dossier 'dist' introuvable après le build"
    exit 1
fi

# Étape 5: Test du build (optionnel)
echo ""
echo "=== Test du build (optionnel) ==="
echo "Pour tester le build localement, exécutez: npm run preview"
echo "Cela démarrera un serveur local sur le port 4173"

echo ""
echo "=== Déploiement terminé avec succès! ==="
echo "Les fichiers de production sont dans le dossier 'dist'"
echo "Vous pouvez maintenant déployer le contenu du dossier 'dist' sur votre serveur web."

# Instructions pour différents types de déploiement
echo ""
echo "=== Instructions de déploiement ==="
echo "1. Serveur web statique (Apache, Nginx): Copiez le contenu de 'dist' vers votre répertoire web"
echo "2. Netlify/Vercel: Connectez ce dépôt et déployez automatiquement"
echo "3. GitHub Pages: Utilisez une action GitHub pour déployer le dossier 'dist'"
echo "4. Docker: Créez une image Nginx servant les fichiers statiques"