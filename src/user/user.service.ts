import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.response.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
        const newUser = await this.userRepository.save(user);
        return "User created successfully";
      }
}
