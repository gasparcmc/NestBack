// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested, IsInt, Min } from 'class-validator';

export class RoleIdDto {
  @ApiProperty({
    description: 'ID del rol',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;
}

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
    example: 'admin22@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  email: string;

  @ApiProperty({
    description: 'Los roles del usuario',
    type: [RoleIdDto],
    example: [{ id: 1 }, { id: 2 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleIdDto)
  roles: RoleIdDto[];
}
  
  