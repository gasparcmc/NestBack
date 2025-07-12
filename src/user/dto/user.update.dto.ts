// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray } from 'class-validator';

export class UserUpdateDto {
    // El nombre de usuario
    @ApiProperty({
        description: 'El nombre de usuario',
        example: 'admin',

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

      })
      @IsString()
      @IsNotEmpty()
      @MinLength(6)
      @MaxLength(32)
    email: string;


    @ApiProperty({
        description: 'Los roles del usuario',
        example: [{id: 1}, {id: 2}],
      })
      @IsArray()
      @IsNotEmpty()
      roles: {id: number}[];
  }
  