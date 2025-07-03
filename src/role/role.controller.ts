import { Controller, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/role.response.dto';
import { Get, UseGuards, Post, Body } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Access } from './access/access.entity';
import { AccessCreateDto } from './access/access.create.dto';

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}

    // Obtener todos los roles
    @Get()
    @UseGuards(JwtGuard)
    async findAll(){
        return this.roleService.findAll();
    }

    // Obtener un rol por su id
    @Get(':id')
    @UseGuards(JwtGuard)
    async findById(@Param('id') id: string){
        return this.roleService.findById(id);
    }

    //crear acceso a un rol
    @Post(':id/access')
    @UseGuards(JwtGuard)
    async createAccess(@Param('id') id: string, @Body() access: AccessCreateDto){
        return this.roleService.createAccess(id, access);
    }





}
