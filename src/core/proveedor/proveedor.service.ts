import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { ProveedorGetAllDto } from './dto/proveedor.getall.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProveedorCreateDto } from './dto/proveedor.create.dto';
import { ProveedorOneDto } from './dto/proveedor.one.dto';

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

}
