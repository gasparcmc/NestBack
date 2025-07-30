import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateProductoDto {


  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @IsString()
  @IsOptional()
  descripcion: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNumber()
  @IsOptional()
  precio: number;

  @ApiProperty({ description:'Imagen de portada'})
  @IsString()
  @IsOptional()
  portada: string;

  @ApiProperty({ description:'Galeria de imagenes'})
  @IsArray()
  @IsOptional()
  galeria: string[];

  @ApiProperty({ description:'Categoria del producto'})
  @IsString()
  @IsOptional()
  categoria: string;

  @ApiProperty({ description:'Subcategoria del producto'})
  @IsString()
  @IsOptional()
  subcategoria: string;

  @ApiProperty({ description:'Marca del producto'})
  @IsString()
  @IsOptional()
  marca: string;
}
