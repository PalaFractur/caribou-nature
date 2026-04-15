# 🚀 Guide de déploiement — Caribou Nature

## Étape 1 : Créer le projet Supabase

1. Allez sur **supabase.com** → "New Project"
2. Nom : `caribou-nature`, Région : `West EU (Paris)`
3. Attendez la création (~2 min)
4. **Settings → API** : copiez `URL` et `anon public key` et `service_role key`
5. **SQL Editor → New Query** : collez et exécutez le contenu de `supabase/schema.sql`
6. **Authentication → Users → Invite user** : créez `admin@caribounature.fr` avec le mot de passe souhaité

## Étape 2 : Créer le compte Stripe

1. Allez sur **stripe.com** → créez un compte
2. Activez votre compte (KYC — carte d'identité requise)
3. **Développeurs → Clés API** : copiez la clé publiable (`pk_live_...`) et secrète (`sk_live_...`)
4. **Développeurs → Webhooks → Add endpoint** :
   - URL : `https://votre-site.vercel.app/api/stripe-webhook`
   - Événements : `checkout.session.completed`
   - Copiez le **Signing secret** (`whsec_...`)

## Étape 3 : Créer le compte Resend

1. Allez sur **resend.com** → créez un compte
2. **Domains** : ajoutez votre domaine (ex : `caribounature.fr`) et vérifiez les DNS
3. **API Keys → Create API Key** : copiez la clé (`re_...`)

## Étape 4 : Déployer sur Vercel

1. Poussez le code sur GitHub
2. Sur **vercel.com** → "Import Project" → sélectionnez le repo
3. Framework : **Vite**
4. **Environment Variables** — ajoutez toutes ces variables :

```
VITE_SUPABASE_URL          = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY     = eyJ...
SUPABASE_SERVICE_ROLE_KEY  = eyJ...
VITE_ADMIN_EMAIL           = admin@caribounature.fr
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY          = sk_live_...
STRIPE_WEBHOOK_SECRET      = whsec_...
RESEND_API_KEY             = re_...
RESEND_FROM_EMAIL          = commandes@caribounature.fr
ADMIN_NOTIFICATION_EMAIL   = caribounature@gmail.com
VITE_SITE_URL              = https://www.caribounature.fr
```

5. Cliquez **Deploy**

## Étape 5 : Mettre à jour l'URL du webhook Stripe

Une fois déployé, mettez à jour l'URL du webhook Stripe avec votre vraie URL Vercel.

## Accès admin

URL : `https://votre-site.vercel.app/admin/login`  
Email : `admin@caribounature.fr`  
Mot de passe : celui défini à l'étape 1

---

## Pour tester en développement

1. Copiez `.env.example` en `.env` et remplissez les valeurs Supabase (mode test Stripe)
2. Installez **Stripe CLI** et lancez : `stripe listen --forward-to localhost:8080/api/stripe-webhook`
3. `npm run dev`
