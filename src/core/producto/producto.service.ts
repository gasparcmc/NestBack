import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/producto.creadte.dto';
import { FindAllProductoDto } from './dto/producto.findAll.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async getAllProductos() {
    try {
    const productos = await this.productoRepository.find();

    const productoDto: FindAllProductoDto[] = productos.map(producto => ({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || 0,
    }));

    return productoDto;
    } catch (error) {
      throw new BadRequestException('Error al obtener los productos');
    }
  }


  async createProducto(data: CreateProductoDto) {
    try {
      
      const producto = this.productoRepository.create(data);
      await this.productoRepository.save(producto);
      return {success: true, message: 'Producto creado correctamente', id: producto.id};

    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async getProductoById(id: number) {
    try {

      const producto = await this.productoRepository.findOne({ where: { id } });
      if (!producto) throw new NotFoundException('Producto no encontrado');
      return producto;
    } catch (error) {
      throw new BadRequestException('Error al obtener el producto');
    }
  }

  async updateProducto(id: number, data: CreateProductoDto) {
    try {
      const producto = await this.productoRepository.findOne({ where: { id } });
      if (!producto) throw new NotFoundException('Producto no encontrado');

      await this.productoRepository.update(id, data);
      return {success: true, message: 'Producto actualizado correctamente'};
    } catch (error) {
      throw new BadRequestException('Error al actualizar el producto');
    }
  }


  async saveGaleria(id: number,  filename: string ) {
    try {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

      if (producto.galeria) {
        producto.galeria.push(filename)
        await this.productoRepository.save(producto);
      return { success: true, message: 'Galería actualizada', galeria: producto.galeria };
      } else {
        throw new BadRequestException('Error al cargar el nombre de la imagen');
      }

    
    } catch (error) {
      throw new BadRequestException('Error al actualizar la galería');
    }
  }

}
