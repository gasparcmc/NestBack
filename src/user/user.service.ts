import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { NotFoundException, BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'src/role/role.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
      ) {}

      // Obtener todos los usuarios
      async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
        }));
      }

      // Obtener un usuario por su id
      async findById(id: string): Promise<UserResponseDto> {

        // Verificar si el id es un número
        if (isNaN(parseInt(id))) {
          throw new BadRequestException('Invalid id');
        }

        // Verificar si el usuario existe
        const user = await this.userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return {
          id: user.id,
          username: user.username,
          email: user.email,
        };
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
        userExists.username = user.username;
        userExists.email = user.email;
        userExists.updatedAt = new Date();
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
        const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) },relations: ['roles'] });
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
        const userExists = await this.userRepository.findOne({ where: { id: parseInt(id) },relations: ['roles'] });
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



}
