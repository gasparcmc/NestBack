import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, IsArray } from "class-validator";

export class UpdateAccessDto {
    @ApiProperty({ description: 'ID del acceso' })
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class RoleUpdateDto {
    @ApiProperty({ description: 'Nombre del rol' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @ApiProperty({ description: 'Accesos del rol' })
    @IsNotEmpty()
    @IsArray()
    accesses: UpdateAccessDto[];
}

