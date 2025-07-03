import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto.login';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    console.log("service:",loginDto);

    const { username, password } = loginDto;

//    const passwordHash = await argon2.hash(password);
//    console.log("passwordHash:",passwordHash);

    // Buscar el usuario en la base de datos
    const user = await this.userRepository.findOne({ where: { username } });
    //console.log("user:",user);

    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Verificar si la contraseña es correcta
    const isPasswordValid = await argon2.verify(user.password, password);
    //console.log("isPasswordValid:",isPasswordValid);


    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Generar el token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    //console.log("token:",token);
    if (!token) {
      throw new UnauthorizedException('Error en la generación del token');
    }
    
    
    return {token:token};
  }
}
