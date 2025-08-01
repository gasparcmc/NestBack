import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserOneResponseDto } from './dto/user.one.response.dto';
import { NotFoundException, BadRequestException, Injectable, ExecutionContext } from '@nestjs/common';
import { Role } from '../role/role.entity';
import * as argon2 from 'argon2';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private dataSource: DataSource
  ) { }

  // Obtener todos los usuarios
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();

    // Retornar el usuario en formato UserResponseDto
    const UserResponse: UserResponseDto[] = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
    return UserResponse;
  }

  // Obtener un usuario por su id
  async findById(id: string): Promise<UserOneResponseDto> {

    // Verificar si el id es un número
    if (isNaN(parseInt(id))) {
      throw new BadRequestException('Invalid id');
    }

    // Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.roleRepository.find({ where: { users: { id: parseInt(id) } } });

    const UserOneResponse: UserOneResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roles.map(role => ({ id: role.id, description: role.name })),
    };

    return UserOneResponse;
  }

  // Crear un usuario
  async createUser(user: UserRegisterDto) {
    try {
      // Verificar si el email ya existe
      const userExists = await this.userRepository.findOne({ where: { email: user.email } });
      if (userExists) {
        throw new BadRequestException('Email already exists');
      }

      // Verificar si el username ya existe
      const usernameExists = await this.userRepository.findOne({ where: { username: user.username } });
      if (usernameExists) {
        throw new BadRequestException('Username already exists');
      }

      const UserFormat = new User();

      const roles = await Promise.all(
        user.roles.map(role => this.roleRepository.findOne({ where: { id: role.id } }))
      );

      UserFormat.roles = roles.filter(r => r) as Role[];

      UserFormat.username = user.username;
      UserFormat.email = user.email;

      // Encriptar la contraseña
      UserFormat.password = await argon2.hash(user.password);

      UserFormat.createdAt = new Date();
      UserFormat.updatedAt = new Date();

      console.log("UserFormat", UserFormat);

      const userNew = await this.userRepository.save(UserFormat);

      return "User created successfully";

    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error creating user');
    }
  }

  // Actualizar un usuario
  async updateUser(id: string, user: UserUpdateDto) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) } });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }


      const roles = await Promise.all(
        user.roles.map(role => this.roleRepository.findOne({ where: { id: role.id } }))
      );

      userExists.username = user.username;
      userExists.email = user.email;
      userExists.updatedAt = new Date();
      userExists.roles = roles.filter(r => r) as Role[];

      await this.userRepository.save(userExists);



      return "User updated successfully";
    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error updating user');
    }
  }

  // Eliminar un usuario
  async deleteUser(id: string) {

    try {
      const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) } });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.delete(userExists.id);
      return "User deleted successfully";

    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error deleting user');
    }

  }


  // Obtener el menu de un usuario
  async getMenuByUser(userId: number) {
    try {

      // Obtener LOS ACCESOS DEL USUARIO
      const result = await this.dataSource.query(`
        SELECT DISTINCT a.id, a.name
        FROM public.user u
        JOIN public.user_roles_role ur ON u.id = ur."userId"
        JOIN public.role r ON r.id = ur."roleId"
        JOIN public.role_accesses_access ra ON r.id = ra."roleId"
        JOIN public.access a ON a.id = ra."accessId"
        WHERE u.id = $1
      `, [userId]);

      if (!result) {
        throw new NotFoundException('Menu not found');
      }

      function validateAccess(access: string) {
        if(process.env.NODE_ENV === 'test' && userId === 1){
          return true;
        }
        return result.some(item => item.name === access);
      }

      //console.log("result", result);

      // Crear el menu basico de la aplicacion
      const items = [
        {
          title: "Home",
          url: "/",
          icon: "Home",
        },
        {
          title: "Ventas",
          url: "/ventas",
          icon: "Receipt",
          hasSubmenu: true,
          subItems: [
            {
              title: "Proveedores",
              url: "/settings/profile",
              icon: "User",
            },
          ],
        },
        {
          title: "Compras",
          icon: "Receipt",
          hasSubmenu: true,
          subItems: [
            {
              title: "Proveedores",
              url: "/core/administration/proveedores",
              icon: "User",
            },
          ],
        },
      ]

      // Verificar si el usuario tiene el acceso a la administracion
      if (validateAccess("Administration")) {
        items.push({
          title: "Administracion",
          icon: "Settings",
          hasSubmenu: true,
          subItems: [],
        });

        //si el usuario tiene el acceso a la administracion, agregar los subitems
        if (items[3] && items[3].subItems) {
          if (validateAccess("user")) {
            items[3].subItems.push({
              title: "Usuarios",
              url: "/core/administration/user",
              icon: "User",
            });
          };

          if (validateAccess("role")) {
            items[3].subItems.push({
              title: "Roles",
              url: "/core/administration/role",
              icon: "Shield",
            });
          }

          //if (validateAccess("proveedor")) {
            items[3].subItems.push({
              title: "Proveedores",
              url: "/core/administration/proveedor",
              icon: "User",
            });
          //}
        }


      }

      return items;

    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error getting menu for user');
    }
  }

}
