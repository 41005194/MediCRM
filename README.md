# MediCRM - CRM Cabinet de Kinésithérapie

**Lien démo** : medi-crm.vercel.app

## Architecture Technique
- **Frontend** : Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts + @dnd-kit
- **Backend** : NestJS + Prisma ORM
- **Base de données** : Supabase PostgreSQL + Realtime
- **Authentification** : Supabase Auth
- **Emailing** : Brevo (transactionnel)
- **Déploiement** : Vercel

## Fonctionnalités implémentées
- Authentification avec rôles (Admin / Kiné)
- Gestion complète des patients et ordonnances
- **Kanban interactif** avec drag & drop + actions par statut (menu ⋮)
- Création automatique de séances + factures
- Dashboard avec KPIs (CA, taux de conversion, RDV du jour)
- Historique d’activité
- Page "Mes rendez-vous" (calendrier hebdomadaire du kiné connecté)
- Intégration Brevo (emails transactionnels automatisés)
- Import/Export CSV des patients
- Facturation simple avec marquage "Payée"
- Design responsive moderne (Tailwind + shadcn/ui)

## MCD Merise (simplifié)
Patient (1,N) — possède — (1,1) Ordonnance — prescrit par — (1,1) Medecin  
Ordonnance (1,N) — génère — (1,1) Séance — réalisée par — (1,1) Profile (Kiné)

## Installation locale
```bash
# 1. Clone le repo
git clone https://github.com/41005194/MediCRM.git
cd MediCRM

# 2. Installation des dépendances
npm run install:all

# 3. Configuration
# Copie .env.example → .env dans /frontend et /backend
# Remplis les variables Supabase + Brevo

# 4. Lancement
npm run dev
```

## Jeu de données test
Utilisez le seed.sql présent dans backend/prisma/seed.sql dans l'éditeur SQL de Supabase

Auteur : Liam PROROVNER – Formation Communication Digitale