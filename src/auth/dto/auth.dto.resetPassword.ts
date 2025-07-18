import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Token', example: '12345678' })
    token: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty({ description: 'Contraseña', example: '12345678' })
    password: string;
}