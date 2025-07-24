import { ApiProperty } from "@nestjs/swagger";

export class ProveedorGetAllDto {
    @ApiProperty({ description: 'ID del proveedor' })
    id: number;
    @ApiProperty({ description: 'Razón social del proveedor' })
    razonSocial: string;
    @ApiProperty({ description: 'Rubro del proveedor' })
    rubro: string;
    @ApiProperty({ description: 'Dirección del proveedor' })
    direccion: string;
    @ApiProperty({ description: 'Teléfono del proveedor' })
    telefono: string;
    @ApiProperty({ description: 'Email del proveedor' })
    email: string;
    @ApiProperty({ description: 'Web del proveedor' })
    web: string;
    @ApiProperty({ description: 'Observaciones del proveedor' })
    observaciones: string;
    @ApiProperty({ description: 'Estado del proveedor' })
    estado: string;
    @ApiProperty({ description: 'CUIT del proveedor' })
    cuit: string;
}