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
            montantEstime: number | null;
            medecinId: string;
            praticienId: string | null;
        }[];
    } & {
        id: string;
        nom: string;
        prenom: string;
        dateNaissance: Date;
        nir: string | null;
        email: string | null;
        telephone: string | null;
        antecedents: string | null;
        adresse: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(dto: CreatePatientDto): Promise<{
        id: string;
        nom: string;
        prenom: string;
        dateNaissance: Date;
        nir: string | null;
        email: string | null;
        telephone: string | null;
        antecedents: string | null;
        adresse: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
