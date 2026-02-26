import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { BrevoService } from 'src/brevo/brevo.service';
export declare class PatientController {
    private prisma;
    private brevo;
    constructor(prisma: PrismaService, brevo: BrevoService);
    findAll(): Promise<({
        ordonnances: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            dateOrdonnance: Date;
            nbSeancesPrescrites: number;
            pathologie: string;
            typePriseEnCharge: string;
            statut: import("@prisma/client").$Enums.PipelineStatut;
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
