import { Controller, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/role.response.dto';
import { Get, UseGuards, Post, Body, Delete, Put } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AccessCreateDto } from './access/access.create.dto';
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
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Obtener todos los roles' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de roles obtenida exitosamente',
        type: [RoleFindAllResponseDto]
    })
    async findAll(): Promise<RoleFindAllResponseDto[]>{
        return this.roleService.findAll();
    }


    //obtener todos los accesos   
    @Get('access')
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:read')
    @ApiOperation({ summary: 'Obtener todos los accesos' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de accesos obtenida exitosamente',
        type: [AccessAllResponseDto]
    })
    async findAllAccesses(): Promise<AccessAllResponseDto[]>{

        console.log("findAllAccesses");
        return this.roleService.findAllAccesses();
    }
    
    // Obtener un rol por su id
    @Get(':id')
    @UseGuards(JwtGuard)
    @RequireAccess('role:read')
    @ApiOperation({ 
        summary: 'Obtener un rol por su id',
        description: 'Obtiene un rol específico con todos sus accesos asociados'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Rol obtenido exitosamente',
        type: RoleOneResponseDto,
    })
    async findById(@Param('id') id: string): Promise<RoleOneResponseDto>{
        return this.roleService.findById(id);
    }



    //crear rol
    @Post()
    @UseGuards(JwtGuard, AccessGuard)
    @RequireAccess('role:create')
    @ApiOperation({ summary: 'Crear un rol' })
    @ApiResponse({ 
        status: 200, 
        description: 'Rol creado exitosamente',
        type: String
    })
    async createRole(@Body() role: RoleUpdateDto){
        return this.roleService.createRole(role);
    }
    
    //actualizar rol
    @Put(':id')
    @UseGuards(JwtGuard)
    @RequireAccess('role:update')
    @ApiOperation({ summary: 'Actualizar un rol' })
    async updateRole(@Param('id') id: string, @Body() role: RoleUpdateDto){
        return this.roleService.updateRole(id, role);
    }

    //crear acceso a un rol
    @Post(':id/access')
    @UseGuards(JwtGuard)
    @RequireAccess('role:create')
    @ApiOperation({ summary: 'Crear un acceso a un rol' })
    async createAccess(@Param('id') id: string, @Body() access: AccessCreateDto){
        return this.roleService.createAccess(id, access);
    }

    //eliminar acceso a un rol
    @Delete(':id/access/:accessId')
    @UseGuards(JwtGuard)
    @RequireAccess('role:delete')
    @ApiOperation({ summary: 'Eliminar un acceso a un rol' })
    async deleteAccess(@Param('id') id: string, @Param('accessId') accessId: string){
        return this.roleService.deleteAccess(id, accessId);
    }

    //actualizar acceso a un rol
    @Put(':id/access/:accessId')
    @UseGuards(JwtGuard)
    @RequireAccess('role:update')
    @ApiOperation({ summary: 'Actualizar un acceso a un rol' })
    async updateAccess(@Param('id') id: string, @Param('accessId') accessId: string, @Body() access: AccessCreateDto){
        return this.roleService.updateAccess(id, accessId, access);
    }

    //agregar acceso a un rol
    @Post(':id/access/:accessId')
    @UseGuards(JwtGuard)
    @RequireAccess('role:create')
    @ApiOperation({ summary: 'Agregar un acceso a un rol' })
    async addAccessToRole(@Param('id') id: string, @Param('accessId') accessId: string){
        return this.roleService.addAccessToRole(id, accessId);
    }

    //eliminar acceso de un rol
    @Delete(':id/access/:accessId')
    @UseGuards(JwtGuard)
    @RequireAccess('role:delete')
    @ApiOperation({ summary: 'Eliminar un acceso de un rol' })
    async removeAccessFromRole(@Param('id') id: string, @Param('accessId') accessId: string){
        return this.roleService.removeAccessFromRole(id, accessId);
    }

    //obtener accesos de un rol
    @Get(':id/access')
    @UseGuards(JwtGuard)
    @RequireAccess('role:read')
    @ApiOperation({ summary: 'Obtener accesos de un rol' })
    async getAccessesByRole(@Param('id') id: string){
        return this.roleService.getAccessesByRole(id);
    }


    
    
}
