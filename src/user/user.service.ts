import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserOneResponseDto } from './dto/user.one.response.dto';
import { NotFoundException, BadRequestException, Injectable, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/role/role.entity';
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
      UserFormat.username = user.username;
      UserFormat.email = user.email;

      // Encriptar la contraseña
      UserFormat.password = await argon2.hash(user.password);

      UserFormat.createdAt = new Date();
      UserFormat.updatedAt = new Date();
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

      await this.userRepository.delete(userExists);
      return "User deleted successfully";

    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error deleting user');
    }

  }

  // Asignar un rol a un usuario
  async assignRoleToUser(id: string, roleId: string) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) } });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }
      const roleExists = await this.roleRepository.findOne({ where: { id: parseInt(roleId) } });
      if (!roleExists) {
        throw new NotFoundException('Role not found');
      }
      userExists.roles.push(roleExists);
      await this.userRepository.save(userExists);
      return "Role assigned to user successfully";
    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error assigning role to user');
    }
  }

  // Obtener los roles de un usuario
  async getRolesByUser(id: string) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) }, relations: ['roles'] });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }
      return userExists.roles;
    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error getting roles by user');
    }
  }

  // Eliminar un rol de un usuario
  async deleteRoleFromUser(id: string, roleId: string) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) }, relations: ['roles'] });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }
      const roleExists = await this.roleRepository.findOne({ where: { id: parseInt(roleId) } });
      if (!roleExists) {
        throw new NotFoundException('Role not found');
      }
      userExists.roles = userExists.roles.filter(role => role.id !== parseInt(roleId));
      await this.userRepository.save(userExists);
      return "Role deleted from user successfully";
    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error deleting role from user');
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

      console.log("result", result);

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
      if(result.some(item => item.name === "Administration")){
        items.push({
            title: "Administracion",
            icon: "Settings",
            hasSubmenu: true,
            subItems: [
              {
                title: "Usuarios",
                url: "/core/administration/user",
                icon: "User",
              },
              {
                title: "Roles",
                url: "/core/administration/role",
                icon: "Shield",
              },
            ],
        });
      }

      return items;

    } catch (error) {
      console.log("error", error);
      throw new BadRequestException('Error getting menu for user');
    }
  }

}
