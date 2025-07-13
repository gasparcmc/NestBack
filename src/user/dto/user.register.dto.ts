// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsArray } from 'class-validator';


export class UserRegisterDto {
    // El nombre de usuario
    @ApiProperty({
        description: 'El nombre de usuario',
        example: 'admin',
        required: true,

      })
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      @MaxLength(32)
    username: string;
    // El email
    @ApiProperty({
        description: 'El email',
        example: 'admin@gmail.com',
        required: true,

      })
      @IsString()
      @IsNotEmpty()
      @MinLength(6)
      @MaxLength(32)
    email: string;
    // La contraseña
    @ApiProperty({
        description: 'La contraseña',
        example: '123456',
        required: true,
        format: 'password',
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(6)
      @MaxLength(32)
    password: string;

    // Los roles del usuario
    @ApiProperty({
      description: 'Los roles del usuario',
      example: [{id: 1}, {id: 2}],
    })
    @IsArray()
    @IsNotEmpty()
    roles: {id: number}[];
  }
  