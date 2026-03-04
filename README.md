# MediCRM - CRM Cabinet de Kinésithérapie

**Lien démo** : [ton lien Vercel]

## Architecture Technique
- **Frontend** : Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts + @dnd-kit
- **Backend** : NestJS + Prisma ORM
- **Base de données** : Supabase PostgreSQL + Realtime
- **Authentification** : Supabase Auth
- **Emailing** : Brevo (transactionnel)
- **Déploiement** : Vercel

## Fonctionnalités implémentées
- Authentification + rôles (Admin / Kine)
- Gestion des patients et médecins
- Pipeline Kanban (5 étapes) avec drag & drop + realtime
- Dashboard analytique (CA, taux de conversion, graphique évolution, RDV du jour)
- Historique des activités
- Emails transactionnels Brevo
- Import/Export CSV
- Vue liste + vue Kanban

## MCD Merise (simplifié)
Patient (1,N) — possède — (1,1) Ordonnance — prescrit par — (1,1) Medecin  
Ordonnance (1,N) — génère — (1,1) Séance — réalisée par — (1,1) Profile (Kiné)

## Installation locale
```bash
npm run dev
```

## Jeu de données test
Utilisez le seed.sql dans backend/prisma/seed.sql

Auteur : Liam PROROVNER – Formation Communication Digitale