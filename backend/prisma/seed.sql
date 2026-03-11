-- =============================================
-- SEED.SQL COMPLET - MediCRM (Mars 2026)
-- =============================================
-- Exécute ce script dans Supabase → SQL Editor

-- Nettoyage des tables existantes
TRUNCATE TABLE "activites", "taches", "seances", "factures", "ordonnances", "medecins", "patients", "profiles" CASCADE;

-- 1. PROFILES (4 profiles)
INSERT INTO "profiles" ("id", "userId", "email", "role", "nom", "prenom", "rpps", "specialite", "createdAt", "updatedAt") VALUES
('prof_1', 'user_1', 'admin@medicrm.fr', 'ADMIN', 'Rivière', 'Sophie', NULL, NULL, '2025-12-01', '2025-12-01'),
('prof_2', 'user_2', 'kine@medicrm.fr', 'KINE', 'Bernard', 'Lucas', '10001234561', 'Sport', '2025-12-01', '2025-12-01'),
('prof_3', 'user_3', 'emma.kine@medicrm.fr', 'KINE', 'Petit', 'Emma', '10009876543', 'Pédiatrie', '2025-12-01', '2025-12-01'),
('prof_4', 'user_4', 'standard@medicrm.fr', 'KINE', 'Martin', 'Julie', NULL, NULL, '2025-12-01', '2025-12-01');

-- 2. MEDECINS (4 médecins)
INSERT INTO "medecins" ("id", "nom", "prenom", "rpps", "specialite", "createdAt", "updatedAt") VALUES
('med_1', 'Dubois', 'Thomas', '81000000001', 'Généraliste', '2025-12-01', '2025-12-01'),
('med_2', 'Leroy', 'Clara', '81000000002', 'Orthopédiste', '2025-12-01', '2025-12-01'),
('med_3', 'Moreau', 'Alain', '81000000003', 'Rhumatologue', '2025-12-01', '2025-12-01'),
('med_4', 'Fontaine', 'Isabelle', '81000000004', 'Médecine du sport', '2025-12-01', '2025-12-01');

-- 3. PATIENTS (12 patients)
INSERT INTO "patients" ("id", "nom", "prenom", "dateNaissance", "nir", "email", "telephone", "adresse", "createdAt", "updatedAt") VALUES
('pat_1', 'Garcia', 'Hugo', '1990-05-15', '1900575123456', 'hugo.g@email.com', '0600000001', 'Paris', '2025-12-01', '2025-12-01'),
('pat_2', 'Michel', 'Sarah', '1985-08-22', '2850875123456', 'sarah.m@email.com', '0600000002', 'Lyon', '2025-12-01', '2025-12-01'),
('pat_3', 'Lefebvre', 'Paul', '1978-02-10', '1780275123456', 'paul.l@email.com', '0600000003', 'Marseille', '2025-12-01', '2025-12-01'),
('pat_4', 'David', 'Léa', '2002-11-30', '2021175123456', 'lea.d@email.com', '0600000004', 'Bordeaux', '2025-12-01', '2025-12-01'),
('pat_5', 'Bertrand', 'Marc', '1965-04-12', '1650475123456', 'marc.b@email.com', '0600000005', 'Lille', '2025-12-01', '2025-12-01'),
('pat_6', 'Roux', 'Chloé', '1995-09-05', '2950975123456', 'chloe.r@email.com', '0600000006', 'Nantes', '2025-12-01', '2025-12-01'),
('pat_7', 'Vincent', 'Jean', '1950-01-20', '1500175123456', 'jean.v@email.com', '0600000007', 'Strasbourg', '2025-12-01', '2025-12-01'),
('pat_8', 'Fournier', 'Julie', '1988-06-18', '2880675123456', 'julie.f@email.com', '0600000008', 'Montpellier', '2025-12-01', '2025-12-01'),
('pat_9', 'Morel', 'Nicolas', '1982-12-03', '1821275123456', 'nicolas.m@email.com', '0600000009', 'Rennes', '2025-12-01', '2025-12-01'),
('pat_10', 'Girard', 'Alice', '1998-07-25', '2980775123456', 'alice.g@email.com', '0600000010', 'Toulouse', '2025-12-01', '2025-12-01'),
('pat_11', 'Andre', 'Pierre', '1972-03-14', '1720375123456', 'pierre.a@email.com', '0600000011', 'Nice', '2025-12-01', '2025-12-01'),
('pat_12', 'Mercier', 'Sonia', '1993-10-11', '2931075123456', 'sonia.m@email.com', '0600000012', 'Grenoble', '2025-12-01', '2025-12-01');

-- 4. ORDONNANCES (15 ordonnances)
INSERT INTO "ordonnances" ("id", "dateOrdonnance", "nbSeancesPrescrites", "pathologie", "typePriseEnCharge", "statut", "montantEstime", "patientId", "medecinId", "praticienId", "createdAt", "updatedAt") VALUES
('ord_1', '2026-01-05', 10, 'Lumbago', 'Standard', 'EN_COURS_DE_SOIN', 300, 'pat_1', 'med_1', 'prof_2', '2026-01-05', '2026-01-05'),
('ord_2', '2026-01-12', 12, 'Entorse cheville', 'Accident Travail', 'EN_COURS_DE_SOIN', 360, 'pat_2', 'med_2', 'prof_2', '2026-01-12', '2026-01-12'),
('ord_3', '2026-01-20', 15, 'Rééduc genou', 'Standard', 'BILAN_PROGRAMME', 450, 'pat_3', 'med_2', 'prof_3', '2026-01-20', '2026-01-20'),
('ord_4', '2026-02-02', 20, 'Scoliose', 'ALD', 'EN_COURS_DE_SOIN', 600, 'pat_4', 'med_1', 'prof_3', '2026-02-02', '2026-02-02'),
('ord_5', '2026-02-10', 8, 'Cervicalgie', 'Standard', 'NOUVELLE_DEMANDE', 240, 'pat_5', 'med_3', 'prof_2', '2026-02-10', '2026-02-10'),
('ord_6', '2026-02-15', 10, 'Tendinite', 'Standard', 'EN_COURS_DE_SOIN', 300, 'pat_6', 'med_4', 'prof_3', '2026-02-15', '2026-02-15'),
('ord_7', '2026-03-01', 12, 'Post-op épaule', 'Standard', 'NOUVELLE_DEMANDE', 360, 'pat_7', 'med_2', 'prof_2', '2026-03-01', '2026-03-01'),
('ord_8', '2026-03-05', 10, 'Plagiocéphalie', 'Standard', 'EN_COURS_DE_SOIN', 300, 'pat_8', 'med_1', 'prof_3', '2026-03-05', '2026-03-05'),
('ord_9', '2026-03-10', 15, 'Bronchiolite', 'Urgence', 'FIN_DE_TRAITEMENT', 450, 'pat_9', 'med_1', 'prof_3', '2026-03-10', '2026-03-10'),
('ord_10', '2026-03-20', 10, 'Fracture poignet', 'Accident Travail', 'EN_COURS_DE_SOIN', 300, 'pat_10', 'med_3', 'prof_2', '2026-03-20', '2026-03-20'),
('ord_11', '2026-04-01', 8, 'Epicondylite', 'Standard', 'NOUVELLE_DEMANDE', 240, 'pat_11', 'med_4', 'prof_2', '2026-04-01', '2026-04-01'),
('ord_12', '2026-04-05', 12, 'Déchirure mollet', 'Standard', 'EN_COURS_DE_SOIN', 360, 'pat_12', 'med_4', 'prof_2', '2026-04-05', '2026-04-05'),
('ord_13', '2026-01-25', 10, 'Douleur hanche', 'Standard', 'SUIVI_PREVENTIF', 300, 'pat_1', 'med_3', 'prof_2', '2026-01-25', '2026-01-25'),
('ord_14', '2026-02-20', 6, 'Bilan posture', 'Standard', 'FIN_DE_TRAITEMENT', 180, 'pat_2', 'med_1', 'prof_3', '2026-02-20', '2026-02-20'),
('ord_15', '2026-04-10', 10, 'Coxarthrose', 'ALD', 'NOUVELLE_DEMANDE', 300, 'pat_3', 'med_3', 'prof_3', '2026-04-10', '2026-04-10');

-- 5. FACTURES (30 factures réparties sur Janvier, Février, Mars 2026 et Décembre 2025)
INSERT INTO "factures" ("id", "dateEmission", "montantTotal", "statut", "patient_id", "createdAt", "updatedAt") VALUES
('fact_1', '2026-01-15', 60, 'PAYE', 'pat_1', '2026-01-15', '2026-01-15'), ('fact_2', '2026-01-20', 90, 'PAYE', 'pat_2', '2026-01-20', '2026-01-20'), ('fact_3', '2026-01-25', 30, 'EN_ATTENTE', 'pat_3', '2026-01-25', '2026-01-25'), ('fact_4', '2026-01-28', 120, 'PAYE', 'pat_1', '2026-01-28', '2026-01-28'), ('fact_5', '2026-01-30', 60, 'PAYE', 'pat_4', '2026-01-30', '2026-01-30'), ('fact_6', '2026-01-31', 30, 'REJETE', 'pat_5', '2026-01-31', '2026-01-31'), ('fact_7', '2026-01-31', 90, 'PAYE', 'pat_6', '2026-01-31', '2026-01-31'),
('fact_8', '2026-02-05', 60, 'PAYE', 'pat_1', '2026-02-05', '2026-02-05'), ('fact_9', '2026-02-12', 30, 'PAYE', 'pat_7', '2026-02-12', '2026-02-12'), ('fact_10', '2026-02-15', 90, 'EN_ATTENTE', 'pat_2', '2026-02-15', '2026-02-15'), ('fact_11', '2026-02-18', 60, 'PAYE', 'pat_8', '2026-02-18', '2026-02-18'), ('fact_12', '2026-02-22', 120, 'PAYE', 'pat_4', '2026-02-22', '2026-02-22'), ('fact_13', '2026-02-25', 30, 'PAYE', 'pat_9', '2026-02-25', '2026-02-25'), ('fact_14', '2026-02-28', 60, 'PAYE', 'pat_10', '2026-02-28', '2026-02-28'),
('fact_15', '2026-03-05', 90, 'PAYE', 'pat_1', '2026-03-05', '2026-03-05'), ('fact_16', '2026-03-10', 30, 'PAYE', 'pat_11', '2026-03-10', '2026-03-10'), ('fact_17', '2026-03-12', 60, 'EN_ATTENTE', 'pat_12', '2026-03-12', '2026-03-12'), ('fact_18', '2026-03-15', 120, 'PAYE', 'pat_2', '2026-03-15', '2026-03-15'), ('fact_19', '2026-03-20', 30, 'PAYE', 'pat_3', '2026-03-20', '2026-03-20'), ('fact_20', '2026-03-22', 90, 'PAYE', 'pat_5', '2026-03-22', '2026-03-22'), ('fact_21', '2026-03-25', 60, 'PAYE', 'pat_6', '2026-03-25', '2026-03-25'), ('fact_22', '2026-03-30', 30, 'REJETE', 'pat_7', '2026-03-30', '2026-03-30'),
('fact_23', '2025-12-02', 90, 'PAYE', 'pat_8', '2025-12-02', '2025-12-02'), ('fact_24', '2025-12-05', 60, 'PAYE', 'pat_9', '2025-12-05', '2025-12-05'), ('fact_25', '2025-12-08', 30, 'EN_ATTENTE', 'pat_10', '2025-12-08', '2025-12-08'), ('fact_26', '2025-12-10', 120, 'PAYE', 'pat_11', '2025-12-10', '2025-12-10'), ('fact_27', '2025-12-12', 30, 'PAYE', 'pat_12', '2025-12-12', '2025-12-12'), ('fact_28', '2025-12-15', 60, 'PAYE', 'pat_1', '2025-12-15', '2025-12-15'), ('fact_29', '2025-12-18', 90, 'PAYE', 'pat_2', '2025-12-18', '2025-12-18'), ('fact_30', '2025-12-20', 30, 'EN_ATTENTE', 'pat_3', '2025-12-20', '2025-12-20');

-- 6. SEANCES 
INSERT INTO "seances" ("id", "dateHeure", "statut", "note", "cotation", "montant", "ordonnanceId", "praticienId", "factureId", "createdAt", "updatedAt") VALUES
-- Séances pour les factures de Janvier 2026 (Liées à prof_2)
('sea_f1', '2026-01-10 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_1', NOW(), NOW()),
('sea_f2', '2026-01-12 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_2', NOW(), NOW()),
('sea_f3', '2026-01-15 11:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_13', 'prof_2', 'fact_3', NOW(), NOW()),
('sea_f4', '2026-01-18 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_4', NOW(), NOW()),
('sea_f5', '2026-01-20 14:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_5', NOW(), NOW()),
('sea_f6', '2026-01-22 15:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_5', 'prof_2', 'fact_6', NOW(), NOW()),
('sea_f7', '2026-01-25 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_7', NOW(), NOW()),

-- Séances pour les factures de Février 2026 (Liées à prof_3)
('sea_f8', '2026-02-02 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_4', 'prof_3', 'fact_8', NOW(), NOW()),
('sea_f9', '2026-02-05 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_3', 'prof_3', 'fact_9', NOW(), NOW()),
('sea_f10', '2026-02-10 11:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_6', 'prof_3', 'fact_10', NOW(), NOW()),
('sea_f11', '2026-02-12 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_4', 'prof_3', 'fact_11', NOW(), NOW()),
('sea_f12', '2026-02-15 14:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_4', 'prof_3', 'fact_12', NOW(), NOW()),
('sea_f13', '2026-02-18 15:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_8', 'prof_3', 'fact_13', NOW(), NOW()),
('sea_f14', '2026-02-20 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_4', 'prof_3', 'fact_14', NOW(), NOW()),

-- Séances pour les factures de Mars 2026 (Mélange prof_2 et prof_3)
('sea_f15', '2026-03-02 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_7', 'prof_2', 'fact_15', NOW(), NOW()),
('sea_f16', '2026-03-05 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_11', 'prof_2', 'fact_16', NOW(), NOW()),
('sea_f17', '2026-03-08 11:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_12', 'prof_2', 'fact_17', NOW(), NOW()),
('sea_f18', '2026-03-10 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_7', 'prof_2', 'fact_18', NOW(), NOW()),
('sea_f19', '2026-03-12 14:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_9', 'prof_3', 'fact_19', NOW(), NOW()),
('sea_f20', '2026-03-15 15:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_9', 'prof_3', 'fact_20', NOW(), NOW()),
('sea_f21', '2026-03-18 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_9', 'prof_3', 'fact_21', NOW(), NOW()),
('sea_f22', '2026-03-20 11:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_9', 'prof_3', 'fact_22', NOW(), NOW()),

-- Séances pour les factures de Décembre 2025 (Liées à prof_2)
('sea_f23', '2025-12-05 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_23', NOW(), NOW()),
('sea_f24', '2025-12-08 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_24', NOW(), NOW()),
('sea_f25', '2025-12-10 11:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_25', NOW(), NOW()),
('sea_f26', '2025-12-12 09:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_26', NOW(), NOW()),
('sea_f27', '2025-12-15 14:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_27', NOW(), NOW()),
('sea_f28', '2025-12-18 15:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_28', NOW(), NOW()),
('sea_f29', '2025-12-20 10:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_29', NOW(), NOW()),
('sea_f30', '2025-12-22 11:00:00', 'EFFECTUE', NULL, 'AMK 16', 30, 'ord_1', 'prof_2', 'fact_30', NOW(), NOW());

-- 7. ACTIVITES (7 activités)
INSERT INTO "activites" ("id", "type", "description", "patientId", "ordonnanceId", "createdAt") VALUES
('act_1', 'appel', 'Appel patient pour décalage RDV', 'pat_1', 'ord_1', '2026-01-08 10:00:00'),
('act_2', 'email', 'Envoi compte-rendu au médecin', 'pat_2', 'ord_2', '2026-01-15 14:00:00'),
('act_3', 'note', 'Dossier incomplet, manque mutuelle', 'pat_4', 'ord_4', '2026-02-01 09:00:00'),
('act_4', 'appel', 'Rappel séance demain', 'pat_6', 'ord_6', '2026-02-14 17:00:00'),
('act_5', 'note', 'Amélioration significative', 'pat_9', 'ord_9', '2026-03-15 11:00:00'),
('act_6', 'appel', 'Relance facture impayée', 'pat_3', NULL, '2026-03-25 10:30:00'),
('act_7', 'note', 'Fin de traitement, exercices à domicile', 'pat_9', 'ord_9', '2026-04-05 16:00:00');

-- FIN DU SEED