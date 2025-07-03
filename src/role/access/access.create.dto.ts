import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class AccessCreateDto {

    @ApiProperty({
        description: 'El nombre del acceso',
        example: 'read_users',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(32)
    name: string;   

}