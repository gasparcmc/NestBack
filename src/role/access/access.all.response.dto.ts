import { ApiProperty } from "@nestjs/swagger";

export class AccessAllResponseDto {
    @ApiProperty({ 
        description: 'ID del acceso',
        example: 1,
        type: Number
    })
    id: number;

    @ApiProperty({ 
        description: 'Nombre del acceso',
        example: 'user:read',
        type: String
    })
    name: string;
}   