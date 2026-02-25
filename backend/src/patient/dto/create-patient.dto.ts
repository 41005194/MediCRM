import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsDateString()
  dateNaissance: string;

  @IsOptional()
  @IsString()
  nir?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  antecedents?: string;

  @IsOptional()
  @IsString()
  adresse?: string;
}