-- =============================================
-- SEED DATA - MediCRM (données de test)
-- À exécuter dans Supabase → SQL Editor
-- =============================================

-- 1. Patients
INSERT INTO patients (id, nom, prenom, dateNaissance, email, telephone, antecedents, adresse, createdAt, updatedAt) VALUES
('p1', 'Dupont', 'Marie', '1990-05-15', 'marie.dupont@gmail.com', '0612345678', 'Entorse cheville récurrente', '12 rue de Paris, 75001 Paris', NOW(), NOW()),
('p2', 'Martin', 'Lucas', '1985-11-22', 'lucas.martin@gmail.com', '0698765432', 'Rééducation post-opératoire genou', '5 avenue des Lilas, 69003 Lyon', NOW(), NOW()),
('p3', 'Bernard', 'Sophie', '1978-03-10', 'sophie.bernard@gmail.com', '0678901234', 'Lombalgie chronique', '8 boulevard Victor Hugo, 33000 Bordeaux', NOW(), NOW()),
('p4', 'Petit', 'Thomas', '1995-07-25', 'thomas.petit@gmail.com', '0611223344', NULL, '25 rue des Acacias, 75016 Paris', NOW(), NOW());

-- 2. Médecins prescripteurs
INSERT INTO medecins (id, nom, prenom, rpps, specialite, createdAt, updatedAt) VALUES
('m1', 'Leclerc', 'Sophie', 'RPPS123456789', 'Rhumatologie', NOW(), NOW()),
('m2', 'Bernard', 'Thomas', 'RPPS987654321', 'Orthopédie', NOW(), NOW()),
('m3', 'Moreau', 'Claire', 'RPPS456789123', 'Médecine du sport', NOW(), NOW());

-- 3. Profils Kinés (utilisateurs de l’application)
INSERT INTO profiles (id, userId, email, role, nom, prenom, rpps, specialite, createdAt, updatedAt) VALUES
('k1', 'auth-user-id-1', 'kine1@medicrm.fr', 'KINE', 'Durand', 'Julien', 'ADELI123456', 'Kiné Sportif', NOW(), NOW()),
('k2', 'auth-user-id-2', 'admin@medicrm.fr', 'ADMIN', 'Morel', 'Sophie', NULL, 'Directrice', NOW(), NOW());

-- 4. Ordonnances (pour tester le pipeline Kanban)
INSERT INTO ordonnances (id, patientId, medecinId, praticienId, dateOrdonnance, nbSeancesPrescrites, pathologie, typePriseEnCharge, statut, createdAt, updatedAt) VALUES
('o1', 'p1', 'm1', 'k1', NOW() - INTERVAL '5 days', 12, 'Entorse cheville gauche', 'ALD', 'NOUVELLE_DEMANDE', NOW(), NOW()),
('o2', 'p2', 'm2', 'k1', NOW() - INTERVAL '3 days', 15, 'Rééducation LCA genou droit', 'Accident de travail', 'BILAN_PROGRAMME', NOW(), NOW()),
('o3', 'p3', 'm1', 'k1', NOW() - INTERVAL '10 days', 20, 'Lombalgie chronique', 'ALD', 'EN_COURS_DE_SOIN', NOW(), NOW()),
('o4', 'p4', 'm3', 'k1', NOW() - INTERVAL '1 day', 8, 'Tendinite épaule', 'Maternité', 'FIN_DE_TRAITEMENT', NOW(), NOW()),
('o5', 'p1', 'm2', 'k1', NOW(), 6, 'Suivi post-entorse', 'Classique', 'SUIVI_PREVENTIF', NOW(), NOW());

-- 5. Activités (historique)
INSERT INTO activites (id, type, description, patientId, ordonnanceId, createdAt) VALUES
('a1', 'patient', 'Nouveau patient créé : Marie Dupont', 'p1', NULL, NOW() - INTERVAL '6 days'),
('a2', 'ordonnance', 'Nouvelle ordonnance créée pour Entorse cheville', 'p1', 'o1', NOW() - INTERVAL '5 days'),
('a3', 'patient', 'Nouveau patient créé : Lucas Martin', 'p2', NULL, NOW() - INTERVAL '4 days');

-- 6. Séances (pour le calendrier et facturation)
INSERT INTO seances (id, ordonnanceId, praticienId, dateHeure, statut, note, cotation, montant, createdAt, updatedAt) VALUES
('s1', 'o1', 'k1', NOW() + INTERVAL '1 day', 'PREVU', 'Bilan initial', 'AMK 9', 9.0, NOW(), NOW()),
('s2', 'o2', 'k1', NOW() + INTERVAL '2 days', 'PREVU', NULL, 'AMS 7.5', 7.5, NOW(), NOW());

-- 7. Factures
INSERT INTO factures (id, dateEmission, montantTotal, statut, createdAt, updatedAt) VALUES
('f1', NOW() - INTERVAL '2 days', 135.0, 'PAYE', NOW(), NOW()),
('f2', NOW(), 82.5, 'EN_ATTENTE', NOW(), NOW());