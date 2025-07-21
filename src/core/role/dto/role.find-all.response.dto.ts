import { ApiProperty } from '@nestjs/swagger';

export class AccessResponseDto {
  @ApiProperty({ description: 'ID del acceso' })
  id: number;

  @ApiProperty({ description: 'Nombre del acceso' })
  name: string;
}

export class RoleFindAllResponseDto {
  @ApiProperty({ description: 'ID del rol' })
  id: number;

  @ApiProperty({ description: 'Nombre del rol' })
  name: string;

  @ApiProperty({ description: 'Lista de accesos asociados al rol', type: [AccessResponseDto] })
  accesses: AccessResponseDto[];
} 