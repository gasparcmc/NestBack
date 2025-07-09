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


    @ApiProperty({ 
        description: 'Orden del acceso',
        example: 1,
        type: Number
    })
    order: number;

    @ApiProperty({ 
        description: 'ID del acceso padre',
        example: 1,
        type: Number
    })
    dad: number;
}   