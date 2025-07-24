import { IsString, IsNotEmpty, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class ProveedorCreateDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    razonSocial: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    rubro: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    direccion: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(10)
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    @MinLength(3)
    email: string;
   
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @MinLength(3)
    web: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @MinLength(3)
    observaciones: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    @MinLength(3)
    estado: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    cuit: string;
}