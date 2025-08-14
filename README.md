
# EconoDeal (Next.js + Vercel)

Landing page FR/EN avec :
- Filtre de magasins (eBay/Walmart/Costco/Canadian Tire/Home Depot/Best Buy/Tous)
- Modale au clic : ventes mensuelles Amazon (Keepa) + moyenne
- API serverless : `/api/keepa-asin` (nécessite `KEEPA_API_KEY`)

## Déploiement rapide (Vercel)
1. Importer ce repo dans Vercel.
2. Ajouter la variable d’environnement :
   - `KEEPA_API_KEY` = votre clé Keepa
3. `npm i` puis `npm run build` (ou laisser Vercel builder)
4. Ouvrir le site.

## Développement local
```bash
npm i
npm run dev
# http://localhost:3000
```
