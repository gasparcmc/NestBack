import { Injectable } from '@nestjs/common';
import { RoleResponseDto } from './dto/role.response.dto';
import { Access } from './access/access.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { AccessCreateDto } from './access/access.create.dto';


@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Access)
        private accessRepository: Repository<Access>,
    ) {}

    async findAll() {
        const roles = await this.roleRepository.find();
        return roles;
    }

    async findById(id: string) {

        // Verificar si el id es un número
        if (isNaN(parseInt(id))) {
            throw new BadRequestException('Invalid id');
        }

        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async createAccess(id: string, access: AccessCreateDto) {

        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) },relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        // Verificar si el acceso ya existe
        const accessExists = await this.accessRepository.findOne({ where: { name: access.name } });
        if (accessExists) {
            throw new BadRequestException('Access already exists');
        }

        try {
        // Crear el acceso
        const newAccess = await this.accessRepository.save(access);
        console.log("newAccess", newAccess);

        // Asociar el acceso al rol
        role.accesses.push(newAccess);


        await this.roleRepository.save(role);

        return 'Access created successfully';
        
        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error creating access');
        }
    }
}
