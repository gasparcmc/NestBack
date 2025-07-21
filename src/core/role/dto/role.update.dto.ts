import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsArray, ValidateNested, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class UpdateAccessDto {
    @ApiProperty({ description: 'ID del acceso' , example: 1})
    @IsNotEmpty()
    @IsInt()
    id: number;
}

export class RoleUpdateDto {
    @ApiProperty({ description: 'Nombre del rol' , example: 'admin'})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @ApiProperty({ description: 'Accesos del rol', type: [UpdateAccessDto], example: [{id: 1}, {id: 2}]})
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAccessDto)
    accesses: UpdateAccessDto[];
}

