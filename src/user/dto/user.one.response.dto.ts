import { ApiProperty } from "@nestjs/swagger";

export class RoleResponseDto {
  @ApiProperty({ description: 'ID del rol', example: 1 })
  id: number;

  @ApiProperty({ description: 'Descripción del rol', example: 'admin' })
  description: string;
}

export class UserOneResponseDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre de usuario', example: 'Juan' })
  username: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan@gmail.com' })
  email: string;

  @ApiProperty({
    description: 'Roles del usuario',
    type: [RoleResponseDto],
    example: [{ id: 1, description: 'admin' }, { id: 2, description: 'user' }],
  })
  roles: RoleResponseDto[];
}