import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { ProveedorGetAllDto } from './dto/proveedor.getall.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProveedorCreateDto } from './dto/proveedor.create.dto';
import { ProveedorOneDto } from './dto/proveedor.one.dto';
import { Brackets } from 'typeorm';

@Injectable()
export class ProveedorService {
    constructor(
        @InjectRepository(Proveedor)
        private readonly proveedorRepository: Repository<Proveedor>,
    ) {}

    async getProveedores()  {
    try {
        const proveedores = await this.proveedorRepository.find();
        return proveedores.map(proveedor => {
            const proveedorDto = new ProveedorGetAllDto();
            proveedorDto.id = proveedor.id;
            proveedorDto.razonSocial = proveedor.razonSocial;
            proveedorDto.rubro = proveedor.rubro;
            proveedorDto.direccion = proveedor.direccion;
            proveedorDto.telefono = proveedor.telefono;
            proveedorDto.email = proveedor.email;
            proveedorDto.web = proveedor.web;
            proveedorDto.observaciones = proveedor.observaciones;
            proveedorDto.estado = proveedor.estado;
            proveedorDto.cuit = proveedor.cuit || '';
            return proveedorDto;
        });
    } catch (error) {
        throw new BadRequestException('Error al obtener los proveedores');
    }
    }

    async getProveedorById(id: number) {
        const proveedor = await this.proveedorRepository.findOne({ where: { id } });
        if (!proveedor) {
            throw new NotFoundException('Proveedor no encontrado');
        }
        const proveedorDto = new ProveedorOneDto();
        proveedorDto.id = proveedor.id;
        proveedorDto.razonSocial = proveedor.razonSocial;
        proveedorDto.rubro = proveedor.rubro;
        proveedorDto.direccion = proveedor.direccion;
        proveedorDto.telefono = proveedor.telefono;
        proveedorDto.email = proveedor.email;
        proveedorDto.web = proveedor.web;
        proveedorDto.estado=proveedor.estado;
        proveedorDto.cuit=proveedor.cuit || '';
        proveedorDto.observaciones=proveedor.observaciones;
        proveedorDto.portada=proveedor.portada || '';


        return proveedorDto;
    }

    async createProveedor(proveedor: ProveedorCreateDto) {
        try {

        const findProveedor = await this.proveedorRepository.findOne({
            where: [
              { razonSocial: proveedor.razonSocial },
              //{ rubro: proveedor.rubro },
              //{ direccion: proveedor.direccion },
              { telefono: proveedor.telefono },
              { email: proveedor.email },
              { web: proveedor.web },
              //{ observaciones: proveedor.observaciones },
              //{ estado: proveedor.estado }
              { cuit: proveedor.cuit }
            ]
          });
          
          console.log("findProveedor", findProveedor);
        if (findProveedor) {
            if (findProveedor.razonSocial === proveedor.razonSocial) {
                throw new BadRequestException('La razon social ya existe');
            }
            if (findProveedor.telefono === proveedor.telefono) {
                throw new BadRequestException('El telefono ya existe');
            }
            if (findProveedor.email === proveedor.email) {
                throw new BadRequestException('El email ya existe');
            }
            if (findProveedor.web === proveedor.web) {
                throw new BadRequestException('La web ya existe');
            }
            if (findProveedor.cuit === proveedor.cuit) {
                throw new BadRequestException('El cuit ya existe');
            }
        }

        const newProveedor = this.proveedorRepository.create(proveedor);


        try {
            await this.proveedorRepository.save(newProveedor);
        } catch (error) {
            console.error('Error al crear el proveedor:', error); 
            throw new BadRequestException('Error al crear el proveedor');
        }

        console.log("Paso create");

        return {
            message: 'Proveedor creado correctamente',
            success: true
        }
    } catch (error) {
        throw new BadRequestException('Error al crear el proveedor');
    }
    }

    async updateProveedor(id: number, proveedor: ProveedorCreateDto) {
        try {
            const query = this.proveedorRepository.createQueryBuilder('proveedor');

            query.where('proveedor.id != :id', { id });
            
            query.andWhere(
              new Brackets(qb => {
                qb.where('proveedor.razonSocial = :razonSocial', { razonSocial: proveedor.razonSocial })
                  .orWhere('proveedor.telefono = :telefono', { telefono: proveedor.telefono })
                  .orWhere('proveedor.email = :email', { email: proveedor.email })
                  .orWhere('proveedor.web = :web', { web: proveedor.web })
                  .orWhere('proveedor.cuit = :cuit', { cuit: proveedor.cuit });
              })
            );
            
            const findProveedor = await query.getOne();
          
        if (findProveedor) {
            if (findProveedor.razonSocial === proveedor.razonSocial) {
                throw new BadRequestException('La razon social ya existe');
            }
            if (findProveedor.telefono === proveedor.telefono) {
                throw new BadRequestException('El telefono ya existe');
            }
            if (findProveedor.email === proveedor.email) {
                throw new BadRequestException('El email ya existe');
            }
            if (findProveedor.web === proveedor.web) {
                throw new BadRequestException('La web ya existe');
            }
            if (findProveedor.cuit === proveedor.cuit) {
                throw new BadRequestException('El cuit ya existe');
            }
        }

        
            await this.proveedorRepository.update(id, proveedor);
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error); 
            throw new BadRequestException('Error al actualizar el proveedor');
        }

        return {success: true, message: "Proveedor actualizado correctamente"};
    }

    // Guarda o actualiza la imagen de portada de un proveedor
    async savePortada(id: number, file: { path: string; filename: string; mimetype: string; }) {
        const proveedor = await this.proveedorRepository.findOne({ where: { id } });
        if (!proveedor) {
            throw new NotFoundException('Proveedor no encontrado');
        }
        // Asume que la entidad Proveedor tiene un campo 'portada' para la ruta de la imagen
        proveedor.portada = file.filename;
        await this.proveedorRepository.save(proveedor);
        return {
            message: 'Portada actualizada',
            portada: file.filename,
        };
    }

}
