import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
        }));
      }
}
