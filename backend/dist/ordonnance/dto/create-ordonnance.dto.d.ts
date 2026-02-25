import { PipelineStatut } from '@prisma/client';
export declare class CreateOrdonnanceDto {
    dateOrdonnance: string;
    nbSeancesPrescrites: number;
    pathologie: string;
    typePriseEnCharge: string;
    statut: PipelineStatut;
    patientId: string;
    medecinId: string;
    praticienId?: string;
}
