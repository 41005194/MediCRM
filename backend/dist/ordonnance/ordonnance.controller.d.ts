import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdonnanceDto } from './dto/create-ordonnance.dto';
export declare class OrdonnanceController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        patient: {
            nom: string;
            prenom: string;
            dateNaissance: Date;
            nir: string | null;
            email: string | null;
            telephone: string | null;
            antecedents: string | null;
            adresse: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        medecin: {
            nom: string;
            prenom: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rpps: string;
            specialite: string;
        };
        praticien: {
            nom: string;
            prenom: string;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rpps: string | null;
            specialite: string | null;
            userId: string;
            role: import("@prisma/client").$Enums.Role;
        } | null;
        seances: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import("@prisma/client").$Enums.StatutSeance;
            praticienId: string;
            dateHeure: Date;
            note: string | null;
            cotation: string;
            montant: number;
            ordonnanceId: string;
            factureId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateOrdonnance: Date;
        nbSeancesPrescrites: number;
        pathologie: string;
        typePriseEnCharge: string;
        statut: import("@prisma/client").$Enums.PipelineStatut;
        patientId: string;
        medecinId: string;
        praticienId: string | null;
        montantEstime: number | null;
    })[]>;
    create(dto: CreateOrdonnanceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateOrdonnance: Date;
        nbSeancesPrescrites: number;
        pathologie: string;
        typePriseEnCharge: string;
        statut: import("@prisma/client").$Enums.PipelineStatut;
        patientId: string;
        medecinId: string;
        praticienId: string | null;
        montantEstime: number | null;
    }>;
}
