import { Controller, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Get , UseGuards, Param, Post, Body, Put, Delete} from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AccessGuard } from '../role/access/access.guard';
import { RequireAccess } from '../role/access/access.decorator';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';



@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:readAll')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos correctamente' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/menu')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Obtener el menu del usuario logueado' })
  getMenuByUser(@CurrentUser() user) {
    return this.userService.getMenuByUser(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:readOne')
  @ApiOperation({ summary: 'Obtener un usuario por su id' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido correctamente'})
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard, AccessGuard)
  @RequireAccess('user:create')
  @ApiOperation({ summary: 'Crear un usuario' })
  createUser(@Body() user: UserRegisterDto) {
    console.log("user", user);
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



}
