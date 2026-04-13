# Guide de Déploiement - TCO-ROI Advisor

## Scripts de déploiement

Ce projet contient deux scripts de déploiement :

### Windows (PowerShell)
```powershell
.\deploy.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x deploy.sh
./deploy.sh
```

## Ce que fait le script

Le script de déploiement reproduit automatiquement les étapes suivantes :

1. **Navigation** : Se place dans le répertoire `tco-roi-advisor-main/`
2. **Installation** : Exécute `npm install --force` pour installer toutes les dépendances
3. **Build** : Exécute `npm run build` pour créer les fichiers de production
4. **Vérification** : Contrôle que le dossier `dist/` a été créé avec succès
5. **Instructions** : Fournit des conseils pour le déploiement final

## Fichiers générés

Après exécution, le script crée :
- `dist/` : Dossier contenant tous les fichiers statiques optimisés pour la production

## Options de déploiement

### 1. Serveur Web Statique
- Copiez le contenu du dossier `dist/` vers votre serveur web (Apache, Nginx, etc.)
- Configurez votre serveur pour servir `index.html` comme page par défaut

### 2. Netlify / Vercel
- Connectez votre dépôt GitHub
- Déploiement automatique à chaque push
- Configuration zero requise

### 3. GitHub Pages
Utilisez une GitHub Action pour déployer automatiquement :

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. Docker
Créez un `Dockerfile` :

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Puis build et run :
```bash
docker build -t tco-roi-advisor .
docker run -p 8080:80 tco-roi-advisor
```

## Test local du build

Après le déploiement, vous pouvez tester localement avec :
```bash
npm run preview
```
Cela démarre un serveur sur `http://localhost:4173`

## Dépannage

### Erreur "npm install"
- Vérifiez que Node.js et npm sont installés
- Supprimez `node_modules/` et `package-lock.json` puis relancez

### Erreur de build
- Vérifiez que toutes les dépendances sont installées
- Consultez les logs d'erreur pour identifier le problème

### Problème de déploiement
- Vérifiez que tous les fichiers du dossier `dist/` sont uploadés
- Assurez-vous que le serveur web sert correctement les fichiers statiques