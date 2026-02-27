# MediCRM - CRM Cabinet Kiné

**Lien démo** : https://medi-crm.vercel.app 

## Stack Technique
- Frontend : Next.js 15 + TypeScript + Tailwind + shadcn/ui + Recharts + @dnd-kit
- Backend : NestJS + Prisma
- Base : Supabase PostgreSQL + Realtime
- Email : Brevo (transactionnel)
- Auth : Supabase Auth

## Fonctionnalités 100 % implémentées
- Auth + rôles
- Gestion Patients & Médecins
- Pipeline Kanban (5 étapes) drag & drop + realtime
- Dashboard analytique (CA, taux conversion, graphique, RDV du jour)
- Emails automatiques Brevo
- Historique d’activité
- Modals création
- Import/Export CSV

## MCD Merise
Patient (1,N) — possède — (1,1) Ordonnance — prescrit par — (1,1) Medecin
Ordonnance (1,N) — génère — (1,1) Seance — réalisée par — (1,1) Profile (Kiné)

## Installation
npm run dev

## Jeu de données test
Utilise le seed.sql dans backend/prisma/seed.sql

Auteur : Liam PROROVNER – Formation Communication Digitale