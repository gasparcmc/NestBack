import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { AccessGuard } from '../role/access/access.guard';
import { JwtGuard } from '../../auth/jwt/jwt.guard';
import { RequireAccess } from '../role/access/access.decorator';
import { Get, Param, Body } from '@nestjs/common';
import {  ApiOperation } from '@nestjs/swagger';
import { ProveedorCreateDto } from './dto/proveedor.create.dto';


@Controller('proveedor')
export class ProveedorController {
  constructor(private proveedorService: ProveedorService) {}

    @Get()
    @UseGuards(JwtGuard,AccessGuard)
    @RequireAccess('proveedor:list')
    @ApiOperation({ summary: 'Obtener todos los proveedores' })
    async getProveedores() {
        return this.proveedorService.getProveedores();
    }

    @Get(':id')
    @UseGuards(JwtGuard,AccessGuard)
    @RequireAccess('proveedor:list')
    @ApiOperation({ summary: 'Obtener un proveedor por su ID' })
    async getProveedorById(@Param('id') id: number) {
        return this.proveedorService.getProveedorById(id);
    }

    @Post()
    @UseGuards(JwtGuard,AccessGuard)
    @RequireAccess('proveedor:create')
    @ApiOperation({ summary: 'Crear un proveedor' })
    async createProveedor(@Body() proveedor: ProveedorCreateDto) {
        return this.proveedorService.createProveedor(proveedor);
    }


}
