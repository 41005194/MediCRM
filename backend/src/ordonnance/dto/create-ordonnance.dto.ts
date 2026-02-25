import { IsString, IsInt, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { PipelineStatut } from '@prisma/client';

export class CreateOrdonnanceDto {
  @IsDateString()
  dateOrdonnance: string;

  @IsInt()
  nbSeancesPrescrites: number;

  @IsString()
  pathologie: string;

  @IsString()
  typePriseEnCharge: string;

  @IsEnum(PipelineStatut)
  statut: PipelineStatut = PipelineStatut.NOUVELLE_DEMANDE;

  @IsOptional()
  @IsUUID()
  patientId: string;

  @IsUUID()
  medecinId: string;

  @IsOptional()
  @IsUUID()
  praticienId?: string;
}