import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre de usuario', example: 'Juan' })
  username: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'juan@gmail.com' })
  email: string;
}
