import { Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { AccessGuard } from '../role/access/access.guard';
import { JwtGuard } from '../../auth/jwt/jwt.guard';
import { RequireAccess } from '../role/access/access.decorator';
import { Get, Param, Body, Put } from '@nestjs/common';
import {  ApiOperation } from '@nestjs/swagger';
import { ProveedorCreateDto } from './dto/proveedor.create.dto';
import { UploadService } from '../upload/upload.service';
import { Request, Response } from 'express';


@Controller('proveedor')
export class ProveedorController {
  constructor(
    private proveedorService: ProveedorService,
    private uploadService: UploadService
  ) {}

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


    @Post(':id/portada')
    @UseGuards(JwtGuard,AccessGuard)
    @RequireAccess('proveedor:upload')
    @ApiOperation({ summary: 'Subir o actualizar imagen de portada' })
    async uploadPortada(
      @Param('id') id: number,
      @Req() req: Request,
      @Res() res: Response
    ) {
      try {
        // 'file' es el nombre del campo en el formulario
        const file = await this.uploadService.uploadPortadaFile(req, res, 'file', id);
        // Guardar la referencia de la imagen en el proveedor
        const result = await this.proveedorService.savePortada(id, file);
        return res.status(201).json({
          success: true,
          message: 'Imagen de portada subida correctamente',
          result,
        });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }


    @Post()
    @UseGuards(JwtGuard,AccessGuard)
    @RequireAccess('proveedor:create')
    @ApiOperation({ summary: 'Crear un proveedor' })
    async createProveedor(@Body() proveedor: ProveedorCreateDto) {
        return this.proveedorService.createProveedor(proveedor);
    }


    @Put(':id')
    @UseGuards(JwtGuard,AccessGuard)
    @RequireAccess('proveedor:update')
    @ApiOperation({ summary: 'Actualizar un proveedor' })
    async updateProveedor(@Param('id') id: number, @Body() proveedor: ProveedorCreateDto) {
        return this.proveedorService.updateProveedor(id, proveedor);
    }



    
}
