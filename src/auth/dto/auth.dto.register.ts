import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty({ description: 'Nombre de usuario', example: 'juan' })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'Email', example: 'juan@gmail.com' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty({ description: 'Contraseña', example: '12345678' })
    password: string;
}