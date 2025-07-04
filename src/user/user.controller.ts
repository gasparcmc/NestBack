import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Get , UseGuards, Param, Post, Body, Put, Delete} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AccessGuard } from 'src/role/access/access.guard';
import { RequireAccess } from 'src/role/access/access.decorator';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:readAll')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:readOne')
  @ApiOperation({ summary: 'Obtener un usuario por su id' })
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:create')
  @ApiOperation({ summary: 'Crear un usuario' })
  createUser(@Body() user: UserRegisterDto) {
    return this.userService.createUser(user);
  }

  @Put(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:update')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  updateUser(@Param('id') id: string, @Body() user: UserUpdateDto) {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:delete')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post(':id/role/:roleId')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:assignRole')
  @ApiOperation({ summary: 'Asignar un rol a un usuario' })
  assignRoleToUser(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.userService.assignRoleToUser(id, roleId);
  }

  @Get(':id/roles')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:readRoles')
  @ApiOperation({ summary: 'Obtener los roles de un usuario' })
  getRolesByUser(@Param('id') id: string) {
    return this.userService.getRolesByUser(id);
  }

  @Delete(':id/role/:roleId')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:deleteRole')
  @ApiOperation({ summary: 'Eliminar un rol de un usuario' })
  deleteRoleFromUser(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.userService.deleteRoleFromUser(id, roleId);
  }
}
