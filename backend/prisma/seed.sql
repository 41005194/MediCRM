-- =============================================
-- SEED.SQL COMPLET - MediCRM (Mars 2026)
-- =============================================
-- Exécute ce script dans Supabase → SQL Editor

-- Nettoyage des données existantes (Optionnel - à commenter si besoin)
TRUNCATE TABLE "activites", "taches", "seances", "factures", "ordonnances", "medecins", "patients", "profiles" CASCADE;

-- 1. PROFILES (Utilisateurs)
INSERT INTO profiles (id, email, nom, prenom, role, createdAt, updatedAt) VALUES
('p-admin', 'admin@medicrm.fr', 'Dupont', 'Sophie', 'ADMIN', NOW(), NOW()),
('p-kine1', 'kine1@medicrm.fr', 'Martin', 'Lucas', 'KINE', NOW(), NOW()),
('p-kine2', 'kine2@medicrm.fr', 'Bernard', 'Emma', 'KINE', NOW(), NOW()),
('p-kine3', 'kine3@medicrm.fr', 'Petit', 'Thomas', 'KINE', NOW(), NOW());

-- 2. MEDECINS (Prescripteurs)
INSERT INTO medecins (id, nom, prenom, rpps, specialite, email, createdAt, updatedAt) VALUES
('m1', 'Lefèvre', 'Claire', '98765432101', 'Rhumatologue', 'claire.lefevre@med.fr', NOW(), NOW()),
('m2', 'Moreau', 'Alexandre', '12345678902', 'Médecin généraliste', 'alex.moreau@med.fr', NOW(), NOW()),
('m3', 'Roux', 'Sophie', '45678912303', 'Orthopédiste', 'sophie.roux@med.fr', NOW(), NOW()),
('m4', 'Blanc', 'Julien', '78912345604', 'Neurologue', 'julien.blanc@med.fr', NOW(), NOW());

-- 3. PATIENTS (12 patients diversifiés)
INSERT INTO patients (id, nom, prenom, "dateNaissance", nir, email, telephone, adresse, antecedents, "createdAt", "updatedAt") VALUES
('pat1', 'Garcia', 'Emma', '1995-03-12', '295031212345678', 'emma.garcia@email.fr', '0612345678', '12 rue des Lilas, 75020 Paris', 'Entorse cheville récurrente', NOW(), NOW()),
('pat2', 'Dubois', 'Lucas', '1988-07-25', '188072512345678', 'lucas.dubois@email.fr', '0623456789', '45 avenue Victor Hugo, 75016 Paris', 'Lombalgie chronique', NOW(), NOW()),
('pat3', 'Martin', 'Chloé', '2001-11-08', '201110812345678', 'chloe.martin@email.fr', '0634567890', '8 boulevard Voltaire, 75011 Paris', 'Rééducation post-op genou', NOW(), NOW()),
('pat4', 'Petit', 'Noah', '1976-04-30', '176043012345678', 'noah.petit@email.fr', '0645678901', '23 rue de la Paix, 75002 Paris', 'Arthrose hanche', NOW(), NOW()),
('pat5', 'Bernard', 'Léa', '1992-09-15', '292091512345678', 'lea.bernard@email.fr', '0656789012', '67 rue Saint-Maur, 75011 Paris', 'Tendinite épaule', NOW(), NOW()),
('pat6', 'Roux', 'Théo', '1985-12-03', '185120312345678', 'theo.roux@email.fr', '0667890123', '14 rue des Fleurs, 75018 Paris', 'Fracture tibia 2025', NOW(), NOW()),
('pat7', 'Moreau', 'Manon', '2004-06-22', '204062212345678', 'manon.moreau@email.fr', '0678901234', '89 boulevard des Batignolles, 75017 Paris', 'Scoliose', NOW(), NOW()),
('pat8', 'Simon', 'Hugo', '1990-01-17', '190011712345678', 'hugo.simon@email.fr', '0689012345', '5 rue de Charonne, 75011 Paris', 'LCA genou', NOW(), NOW()),
('pat9', 'Laurent', 'Inès', '1982-08-09', '182080912345678', 'ines.laurent@email.fr', '0690123456', '32 avenue de la République, 75011 Paris', 'Cervicalgie chronique', NOW(), NOW()),
('pat10', 'Blanc', 'Ethan', '1998-05-14', '198051412345678', 'ethan.blanc@email.fr', '0701234567', '27 rue Oberkampf, 75011 Paris', 'Rééducation épaule', NOW(), NOW()),
('pat11', 'Fontaine', 'Zoé', '2000-02-28', '200022812345678', 'zoe.fontaine@email.fr', '0712345678', '3 rue de Belleville, 75020 Paris', 'Entorse poignet', NOW(), NOW()),
('pat12', 'Mercier', 'Liam', '1979-10-05', '179100512345678', 'liam.mercier@email.fr', '0723456789', '56 avenue de Clichy, 75017 Paris', 'Prothèse hanche', NOW(), NOW());

-- 4. ORDONNANCES (15 ordonnances dans tous les statuts du pipeline)
INSERT INTO ordonnances (id, "patientId", "medecinId", "praticienId", pathologie, statut, "dateOrdonnance", "createdAt", "updatedAt") VALUES
('ord1', 'pat1', 'm1', 'p-kine1', 'Entorse cheville', 'NOUVELLE_DEMANDE', '2026-03-01', NOW(), NOW()),
('ord2', 'pat2', 'm2', 'p-kine1', 'Lombalgie', 'BILAN_PROGRAMME', '2026-02-20', NOW(), NOW()),
('ord3', 'pat3', 'm1', 'p-kine2', 'Rééducation genou', 'EN_COURS_DE_SOIN', '2026-02-15', NOW(), NOW()),
('ord4', 'pat4', 'm3', 'p-kine1', 'Arthrose hanche', 'EN_COURS_DE_SOIN', '2026-02-10', NOW(), NOW()),
('ord5', 'pat5', 'm2', 'p-kine2', 'Tendinite épaule', 'FIN_DE_TRAITEMENT', '2026-02-05', NOW(), NOW()),
('ord6', 'pat6', 'm1', 'p-kine1', 'Fracture tibia', 'SUIVI_PREVENTIF', '2026-01-20', NOW(), NOW()),
('ord7', 'pat7', 'm3', 'p-kine2', 'Scoliose', 'BILAN_PROGRAMME', '2026-03-05', NOW(), NOW()),
('ord8', 'pat8', 'm2', 'p-kine1', 'LCA genou', 'EN_COURS_DE_SOIN', '2026-02-25', NOW(), NOW()),
('ord9', 'pat9', 'm1', 'p-kine2', 'Cervicalgie', 'NOUVELLE_DEMANDE', '2026-03-08', NOW(), NOW()),
('ord10', 'pat10', 'm3', 'p-kine1', 'Épaule post-op', 'FIN_DE_TRAITEMENT', '2026-02-01', NOW(), NOW()),
('ord11', 'pat11', 'm2', 'p-kine2', 'Poignet', 'BILAN_PROGRAMME', '2026-03-03', NOW(), NOW()),
('ord12', 'pat12', 'm1', 'p-kine1', 'Han che prothèse', 'EN_COURS_DE_SOIN', '2026-02-18', NOW(), NOW()),
('ord13', 'pat1', 'm1', 'p-kine1', 'Cheville 2e séance', 'EN_COURS_DE_SOIN', '2026-03-02', NOW(), NOW()),
('ord14', 'pat3', 'm1', 'p-kine2', 'Genou suivi', 'SUIVI_PREVENTIF', '2026-02-28', NOW(), NOW()),
('ord15', 'pat5', 'm2', 'p-kine1', 'Épaule finale', 'FIN_DE_TRAITEMENT', '2026-02-12', NOW(), NOW());

-- 5. SEANCES (25 séances)
INSERT INTO seances (id, "ordonnanceId", "praticienId", "dateHeure", statut, note, cotation, montant, "createdAt", "updatedAt") VALUES
('s1', 'ord2', 'p-kine1', '2026-03-12 09:00:00', 'PREVU', 'Premier bilan', 'AMK 9', 30, NOW(), NOW()),
('s2', 'ord3', 'p-kine2', '2026-03-11 14:30:00', 'PREVU', 'Séance 5/12', 'AMK 9', 30, NOW(), NOW()),
('s3', 'ord4', 'p-kine1', '2026-03-13 10:00:00', 'PREVU', 'Travail mobilité', 'AMK 9', 30, NOW(), NOW()),
('s4', 'ord5', 'p-kine2', '2026-03-10 11:00:00', 'REALISE', 'Dernière séance', 'AMK 9', 30, NOW(), NOW()),
('s5', 'ord6', 'p-kine1', '2026-03-25 15:30:00', 'PREVU', 'Suivi 1/3', 'AMK 9', 30, NOW(), NOW()),
('s6', 'ord8', 'p-kine1', '2026-03-14 08:30:00', 'PREVU', 'Renforcement LCA', 'AMK 9', 30, NOW(), NOW()),
('s7', 'ord9', 'p-kine2', '2026-03-15 16:00:00', 'PREVU', 'Bilan cervical', 'AMK 9', 30, NOW(), NOW()),
('s8', 'ord11', 'p-kine2', '2026-03-18 09:30:00', 'PREVU', 'Poignet', 'AMK 9', 30, NOW(), NOW()),
('s9', 'ord13', 'p-kine1', '2026-03-20 10:00:00', 'PREVU', 'Cheville', 'AMK 9', 30, NOW(), NOW()),
('s10', 'ord14', 'p-kine2', '2026-04-05 14:00:00', 'PREVU', 'Genou suivi', 'AMK 9', 30, NOW(), NOW());

-- 6. FACTURES (18 factures)
INSERT INTO factures (id, montantTotal, statut, "createdAt", "updatedAt") VALUES

-- JANVIER 2026 (CA élevé)
('f-jan1', 30, 'PAYE', '2026-01-05 10:00:00', NOW()),
('f-jan2', 45, 'PAYE', '2026-01-08 14:30:00', NOW()),
('f-jan3', 25, 'PAYE', '2026-01-12 09:15:00', NOW()),
('f-jan4', 30, 'PAYE', '2026-01-15 11:00:00', NOW()),
('f-jan5', 50, 'EN_ATTENTE', '2026-01-18 16:45:00', NOW()),
('f-jan6', 30, 'PAYE', '2026-01-22 08:30:00', NOW()),
('f-jan7', 35, 'PAYE', '2026-01-25 13:20:00', NOW()),
('f-jan8', 40, 'PAYE', '2026-01-28 10:00:00', NOW()),

-- FÉVRIER 2026
('f-fev1', 30, 'PAYE', '2026-02-02 09:00:00', NOW()),
('f-fev2', 25, 'PAYE', '2026-02-05 14:00:00', NOW()),
('f-fev3', 30, 'EN_ATTENTE', '2026-02-08 11:30:00', NOW()),
('f-fev4', 45, 'PAYE', '2026-02-10 16:00:00', NOW()),
('f-fev5', 20, 'PAYE', '2026-02-12 08:45:00', NOW()),
('f-fev6', 35, 'PAYE', '2026-02-15 10:15:00', NOW()),
('f-fev7', 30, 'EN_ATTENTE', '2026-02-18 13:30:00', NOW()),
('f-fev8', 50, 'PAYE', '2026-02-20 09:45:00', NOW()),
('f-fev9', 30, 'PAYE', '2026-02-23 14:20:00', NOW()),
('f-fev10', 40, 'PAYE', '2026-02-26 11:00:00', NOW()),

-- MARS 2026 (mois en cours)
('f-mar1', 30, 'PAYE', '2026-03-01 10:00:00', NOW()),
('f-mar2', 25, 'EN_ATTENTE', '2026-03-03 15:30:00', NOW()),
('f-mar3', 35, 'PAYE', '2026-03-05 09:15:00', NOW()),
('f-mar4', 30, 'PAYE', '2026-03-07 14:00:00', NOW()),
('f-mar5', 45, 'EN_ATTENTE', '2026-03-09 08:30:00', NOW()),
('f-mar6', 20, 'PAYE', '2026-03-10 11:45:00', NOW()),
('f-mar7', 30, 'PAYE', '2026-03-12 16:00:00', NOW()),
('f-mar8', 40, 'EN_ATTENTE', '2026-03-14 10:20:00', NOW()),
('f-mar9', 35, 'PAYE', '2026-03-16 13:10:00', NOW()),
('f-mar10', 50, 'PAYE', '2026-03-18 09:00:00', NOW()),
('f-mar11', 30, 'EN_ATTENTE', '2026-03-20 14:30:00', NOW()),
('f-mar12', 25, 'PAYE', '2026-03-22 11:15:00', NOW()),
('f-mar13', 30, 'PAYE', '2026-03-25 08:45:00', NOW()),
('f-mar14', 45, 'EN_ATTENTE', '2026-03-27 15:00:00', NOW()),
('f-mar15', 35, 'PAYE', '2026-03-29 10:30:00', NOW());

-- 7. ACTIVITES (Historique)
INSERT INTO activites (id, type, description, "patientId", "ordonnanceId", "createdAt") VALUES
('a1', 'patient', 'Nouveau patient Emma Garcia', 'pat1', NULL, NOW()),
('a2', 'ordonnance', 'Ordonnance Lucas Dubois passée en Bilan Programmé', 'pat2', 'ord2', NOW()),
('a3', 'seance', 'Séance créée pour Chloé Martin', 'pat3', 'ord3', NOW()),
('a4', 'facture', 'Facture générée pour Noah Petit', 'pat4', NULL, NOW()),
('a5', 'patient', 'Nouveau patient Léa Bernard', 'pat5', NULL, NOW()),
('a6', 'ordonnance', 'Ordonnance Théo Roux en Suivi Préventif', 'pat6', 'ord6', NOW()),
('a7', 'seance', 'Séance réalisée pour Hugo Simon', 'pat8', 'ord8', NOW()),
('a8', 'facture', 'Facture payée pour Inès Laurent', 'pat9', NULL, NOW()),
('a9', 'ordonnance', 'Ordonnance Zoé Fontaine créée', 'pat11', 'ord11', NOW()),
('a10', 'seance', 'Suivi préventif pour Liam Mercier', 'pat12', 'ord14', NOW());

-- Mise à jour des timestamps pour cohérence
UPDATE profiles SET "createdAt" = NOW(), "updatedAt" = NOW();
UPDATE patients SET "createdAt" = NOW(), "updatedAt" = NOW();
UPDATE ordonnances SET "createdAt" = NOW(), "updatedAt" = NOW();
UPDATE seances SET "createdAt" = NOW(), "updatedAt" = NOW();
UPDATE factures SET "createdAt" = NOW(), "updatedAt" = NOW();

-- FIN DU SEED