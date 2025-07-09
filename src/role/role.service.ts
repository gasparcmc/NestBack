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
            name: access.name
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


    async deleteAccess(id: string, accessId: string) {
        try {

        // Verificar si el acceso existe
        const access = await this.accessRepository.findOne({ where: { id: parseInt(accessId) } });
        if (!access) {
            throw new NotFoundException('Access not found');
        }

        // Verificar si el acceso existe en el rol
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) },relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        else {
            // Eliminar el acceso del rol
            role.accesses = role.accesses.filter(access => access.id !== parseInt(accessId));
            await this.roleRepository.save(role);
        }

        

        // Eliminar el acceso
        await this.accessRepository.remove(access);
        return "Access deleted from role successfully";

        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error deleting access');
        }
    }
    

    async updateAccess(id: string, accessId: string, access: AccessCreateDto) {
        try {
        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) },relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error updating access');
        }
    }

    async addAccessToRole(id: string, accessId: string) {
        try {
        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) },relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        // Verificar si el acceso existe
        const access = await this.accessRepository.findOne({ where: { id: parseInt(accessId) } });
        if (!access) {
            throw new NotFoundException('Access not found');
        }

        // Agregar el acceso al rol
        role.accesses.push(access);
        await this.roleRepository.save(role);
        return "Access added to role successfully";

        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error adding access to role');
        }
    }

    async removeAccessFromRole(id: string, accessId: string) {
        try {
        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) },relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error removing access from role');
        }
    }

    async getAccessesByRole(id: string) {
        try {
        // Verificar si el rol existe
        const role = await this.roleRepository.findOne({ where: { id: parseInt(id) },relations: ['accesses'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role.accesses;
        } catch (error) {
            console.log("error", error);
            throw new BadRequestException('Error getting accesses by role');
        }
    }



    

    
}
