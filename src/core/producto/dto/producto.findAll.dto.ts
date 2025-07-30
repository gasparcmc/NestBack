import { ApiProperty } from "@nestjs/swagger";


export class FindAllProductoDto {
  @ApiProperty({ description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del producto' })
  descripcion: string;

  @ApiProperty({ description: 'Precio del producto' })
  precio: number;
}