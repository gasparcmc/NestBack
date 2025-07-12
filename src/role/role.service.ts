import { Injectable } from '@nestjs/common';
import { RoleResponseDto } from './dto/role.response.dto';
import { Access } from './access/access.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { AccessCreateDto } from './access/access.create.dto';
import { User } from 'src/user/user.entity';
import { RoleFindAllResponseDto } from './dto/role.find-all.response.dto';
import { RoleOneResponseDto , AccessResponseDto} from './dto/role.one.response.dto';
import { AccessAllResponseDto } from './access/access.all.response.dto';
import { RoleUpdateDto } from './dto/role.update.dto';
import { access } from 'fs';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Access)
        private accessRepository: Repository<Access>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<RoleFindAllResponseDto[]> {
        const roles = await this.roleRepository.find({relations: ['accesses']});
        return roles;
    }

    async findById(id: string): Promise<RoleOneResponseDto> {

        // Verificar si el id es un número
        if (isNaN(parseInt(id))) {
            throw new BadRequestException('Invalid id');
        }

        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) }, relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        const roleResponse: RoleOneResponseDto = {
            id: role.id,
            name: role.name,
            accesses: role.accesses.map((access): AccessResponseDto => ({
                id: access.id,
                name: access.name
            }))
        };
        return roleResponse;
    }

    async findAllAccesses(): Promise<AccessAllResponseDto[]> {

        const accesses = await this.accessRepository.find();
        
        const accessResponse: AccessAllResponseDto[] = accesses.map((access): AccessAllResponseDto => ({
            id: access.id,
            name: access.name,
            order: access.order,
            dad: access.dad
        }));
        return accessResponse;
    }


    async createRole(role: RoleUpdateDto) {
        try {

            // Verificar si el rol ya existe
            const roleExists = await this.roleRepository.findOne({ where: { name: role.name } });
            if (roleExists) {
                throw new BadRequestException('Role already exists');
            }

            const newRole = await this.roleRepository.save(role);

            return "Role created successfully";

        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error creating role');
        }
    }

    async updateRole(id: string, role: RoleUpdateDto) {
        try {
            // Verificar si el rol existe
            const roleExists = await this.roleRepository.findOne({ 
                where: { id: parseInt(id) }, 
                relations: ['accesses'] 
            });
            if (!roleExists) {
                throw new NotFoundException('Role not found');
            }

            // Actualizar el nombre del rol
            roleExists.name = role.name;

            // Si se proporcionan accesos, actualizar la relación
            if (role.accesses && role.accesses.length > 0) {
                // Buscar los accesos por sus IDs
                const accessIds = role.accesses.map(access => access.id);
                console.log("accessIds", accessIds);
                const accesses = await this.accessRepository.findByIds(accessIds);
                
                // Actualizar la relación
                roleExists.accesses = accesses;
            }

            await this.roleRepository.save(roleExists);

            return "Role updated successfully";
        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error updating role');
        }
    }


    async deleteRole(id: string) {
        try {
            // Verificar si el rol existe
            const role = await this.roleRepository.findOne({ where: { id: parseInt(id) } });
            if (!role) {
                throw new NotFoundException('Role not found');
            }

            // Verificar si el rol tiene usuarios
            const users = await this.userRepository.find({ where: { roles: { id: parseInt(id) } } });
            if (users.length > 0) {
                throw new BadRequestException('Role has users');
            }

            // Eliminar el rol
            await this.roleRepository.delete(id);
            return "Role deleted successfully";
        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error deleting role');
        }
    }
    
}
