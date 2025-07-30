import { Controller, Post, Get, Put, Param, Body, Req, Res, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { UploadService } from '../upload/upload.service';
import { JwtGuard } from '../../auth/jwt/jwt.guard';
import { AccessGuard } from '../role/access/access.guard';
import { RequireAccess } from '../role/access/access.decorator';
import { Request, Response } from 'express';
import { CreateProductoDto } from './dto/producto.creadte.dto';

@Controller('producto')
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly uploadService: UploadService
  ) {}


  @Post(':id/galeria')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('producto:upload')
  async uploadGaleria(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    // Aquí podrías implementar lógica para múltiples archivos
    const file = await this.uploadService.uploadGaleriaFile(req, res, 'file');
    const result = await this.productoService.saveGaleria(+id, file.filename);
    return res.status(201).json({ message: 'Galería subida', result });
  }


  @Post()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('producto:create')
  async createProducto(@Body() body: CreateProductoDto) {
    return this.productoService.createProducto(body);
  }

  @Get(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('producto:list')
  async getProducto(@Param('id') id: number) {
    return this.productoService.getProductoById(+id);
  }

  @Get()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('producto:list')
  async getAllProductos() {
    return this.productoService.getAllProductos();
  }

  @Put(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('producto:update')
  async updateProducto(@Param('id') id: number, @Body() body: CreateProductoDto) {
    return this.productoService.updateProducto(+id, body);
  }



}
