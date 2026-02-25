import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
export declare class PatientController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        ordonnances: {
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
        }[];
    } & {
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
    })[]>;
    create(dto: CreatePatientDto): Promise<{
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
    }>;
}
