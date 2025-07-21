import { ApiProperty } from "@nestjs/swagger";


export class AccessResponseDto {
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

export class RoleOneResponseDto {
  @ApiProperty({ 
    description: 'ID del rol',
    example: 1,
    type: Number
  })
  id: number;

  @ApiProperty({ 
    description: 'Nombre del rol',
    example: 'admin',
    type: String
  })
  name: string;

  @ApiProperty({ 
    description: 'Lista de accesos asociados al rol', 
    example: [
        {
            id: 1,
            name: 'user:read'
        },
        
    ],
    type: [AccessResponseDto]
  })
  accesses: AccessResponseDto[];
}


