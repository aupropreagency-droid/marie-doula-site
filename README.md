# Site de Marie Graugnard · Doula à Paris

Site statique (HTML + CSS, aucune dépendance). Les pages sont générées par `build.mjs` dans le dossier `public/`.

## Structure
- `build.mjs` : contenus (services, tarifs, avis, FAQ, messages WhatsApp) + gabarits des pages
- `src/styles.css` : charte (couleurs du logo, Fraunces + DM Sans)
- `src/carrousel.js` : points des carrousels de services sur mobile
- `src/images/` : logo et photos
- `public/` : site généré, prêt à déployer (versionné pour l'envoi direct sur Cloudflare)

## Modifier un contenu
1. Modifier le texte dans `build.mjs` (tableau `services` pour les offres)
2. `npm run build`
3. Commit + push : Cloudflare redéploie tout seul

## Déployer sur Cloudflare Pages
Workers & Pages → Create → Pages → Connect to Git → choisir ce dépôt
- Framework preset : None
- Build command : `node build.mjs`
- Build output directory : `public`

Sans Git : Create → Pages → Upload assets → glisser le dossier `public/`.

## Avant la mise en ligne définitive
- Passer `PREVISU` à `false` dans `build.mjs` (le site est actuellement en `noindex`)
- Compléter les mentions légales (SIRET, n° SAP, adresse) et la liste des zones d'intervention
- Remplacer les photos par des versions HD
- Brancher le nom de domaine
