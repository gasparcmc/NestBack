import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, IsArray } from "class-validator";

export class UpdateAccessDto {
    @ApiProperty({ description: 'ID del acceso' , example: 1})
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class RoleUpdateDto {
    @ApiProperty({ description: 'Nombre del rol' , example: 'admin'})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @ApiProperty({ description: 'Accesos del rol' , example: [{id: 1}, {id: 2}]})
    @IsNotEmpty()
    @IsArray()
    accesses: UpdateAccessDto[];
}

