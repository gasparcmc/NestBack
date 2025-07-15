import { Controller, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { Get, UseGuards, Post, Body, Delete, Put } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RequireAccess } from '../role/access/access.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleFindAllResponseDto } from './dto/role.find-all.response.dto';
import { RoleOneResponseDto } from './dto/role.one.response.dto';
import { AccessAllResponseDto } from './access/access.all.response.dto';
import { AccessGuard } from 'src/role/access/access.guard';
import { RoleUpdateDto } from './dto/role.update.dto';


@ApiTags('Role')
@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}

    // Obtener todos los roles
    @Get()
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:readAll')
    @ApiOperation({ summary: 'Obtener todos los roles' })
    @ApiResponse({status: 200,description: 'Lista de roles obtenida exitosamente'})
    async findAll(): Promise<RoleFindAllResponseDto[]>{
        return this.roleService.findAll();
    }


    //obtener todos los accesos   
    @Get('access')
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:read')
    @ApiOperation({ summary: 'Obtener todos los accesos' })
    @ApiResponse({ status: 200,description: 'Lista de accesos obtenida exitosamente'})
    async findAllAccesses(): Promise<AccessAllResponseDto[]>{
        return this.roleService.findAllAccesses();
    }
    
    // Obtener un rol por su id
    @Get(':id')
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:read')
    @ApiOperation({summary: 'Obtener un rol por su id',description: 'Obtiene un rol específico con todos sus accesos asociados'})
    @ApiResponse({status: 200,description: 'Rol obtenido exitosamente'})
    async findById(@Param('id') id: string): Promise<RoleOneResponseDto>{
        return this.roleService.findById(id);
    }

    //crear rol
    @Post()
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:create')
    @ApiOperation({ summary: 'Crear un rol' })
    @ApiResponse({status: 200,description: 'Rol creado exitosamente'})
    async createRole(@Body() role: RoleUpdateDto){
        return this.roleService.createRole(role);
    }
    
    //actualizar rol
    @Put(':id')
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:update')
    @ApiOperation({ summary: 'Actualizar un rol'})
    async updateRole(@Param('id') id: string, @Body() role: RoleUpdateDto){
        return this.roleService.updateRole(id, role);
    }


    //eliminar rol
    @Delete(':id')
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:delete')
    @ApiOperation({ summary: 'Eliminar un rol' })
    async deleteRole(@Param('id') id: string){
        return this.roleService.deleteRole(id);
    }
    
}
