# MediCRM - CRM Cabinet Paramédical Kiné

Système de gestion pour cabinet paramédical kinésithérapie, basé sur une architecture moderne avec authentification sécurisée et pipeline de gestion des ordonnances.

---

## 📋 Table des matières

- [Stack Technique](#stack-technique)
- [Architecture](#architecture)
- [Modèle de Données](#modèle-de-données)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Liens Utiles](#liens-utiles)

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui |
| **Backend** | NestJS + Prisma ORM + Supabase PostgreSQL |
| **Authentification** | Supabase Auth (JWT) avec rôles |
| **Email** | Brevo (transactionnel) |
| **Déploiement** | Vercel (frontend) + Vercel/Railway (backend) |

---

## 🏗️ Architecture

```
medi-crm/
├── backend/          ← NestJS API REST
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/         ← Next.js
│   ├── app/
│   ├── public/
│   └── package.json
├── package.json
└── README.md
```

---

## 📊 Modèle de Données

**Relations principales :**

```
Patient (1,N) ─── Ordonnance ─── (1,1) Medecin
Ordonnance (1,N) ─── Seance ─── (1,1) Profile (Kiné)
```

**Pipeline Ordonnance :** Nouvelle demande → Suivi préventif

---

## ✨ Fonctionnalités

### Fonctionnalités livrées
- ✅ Authentification Supabase avec rôles (Admin / Kiné / Standard)
- ✅ CRUD Patients & Ordonnances (avec pipeline)
- ✅ Protection JWT sur tous les endpoints
- ✅ Base de données Supabase PostgreSQL en ligne

### À venir
- 📌 Kanban de gestion de tâches
- 📈 Dashboard Chiffre d'Affaires
- 📧 Intégration Brevo complète
- 🎯 Gestion avancée des séances

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Étapes

1. **Installer les dépendances racine**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Remplissez vos clés Supabase dans `.env`

3. **Initialiser la base de données**
   ```bash
   cd backend
   npm run prisma:push
   ```

---

## ▶️ Démarrage

### Développement local

**Backend (NestJS - Port 3001)**
```bash
cd backend
npm run start:dev
```

**Frontend (Next.js - Port 3000)**
```bash
cd frontend
npm run dev
```

Accédez à l'application sur `http://localhost:3000`

---