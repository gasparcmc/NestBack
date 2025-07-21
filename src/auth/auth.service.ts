import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto.login';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../core/user/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { EmailService } from '../core/email/email.service';
import { RegisterDto } from './dto/auth.dto.register';

import { ResetPasswordDto } from './dto/auth.dto.resetPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto) {

    const { username, password } = loginDto;


    const passwordHash = await argon2.hash(password);
    console.log("passwordHash: ", passwordHash);
    console.log("password: ", password);
    // Buscar el usuario en la base de datos
    const user = await this.userRepository.findOne({ where: { username } });

    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Verificar si la contraseña es correcta
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Generar el token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    if (!token) {
      throw new UnauthorizedException('Error en la generación del token');
    }
    
    return {token:token};
  }

  async verifyToken(token: string) {
    try {
      // Verificar y decodificar el token
      const payload = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
      
      // Buscar el usuario en la base de datos
      const user = await this.userRepository.findOne({ 
        where: { id: payload.userId },
        relations: ['roles', 'roles.accesses']
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Devolver información del usuario (sin contraseña)
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles?.map(role => ({
          id: role.id,
          name: role.name,
          accesses: role.accesses?.map(access => ({
            id: access.id,
            name: access.name
          }))
        })) || []
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new UnauthorizedException('Email no válido');
    }
    const user = await this.userRepository.findOne({ where: { email:email } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Generar token de reset de contraseña
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    user.tokenResetPassword = token;
    user.tokenResetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas
    await this.userRepository.save(user);

    // Enviar email de reset de contraseña
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Reset de contraseña',
      template: 'resetPassword',
      context: {
        username: user.username,
        token: token,
        appUrl: process.env.FRONTEND_URL,
        appName: process.env.APP_NAME,
        resetUrl: `${process.env.FRONTEND_URL}/auth/newpassword?token=${token}`
      }
    });
    return {
      success: true,
      message: 'Email de reset de contraseña enviado exitosamente'
    };

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const user = await this.userRepository.findOne({ where: { tokenResetPassword: token } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const minutos = parseInt(process.env.TOKEN_EXPIRATION_PASSWORD || '15');//si no existe, se usa 15 minutos
    if (user.tokenResetPasswordExpires && user.tokenResetPasswordExpires < new Date(Date.now() + 1000 * 60 * minutos)) {
      throw new UnauthorizedException('Token expirado');
    }


    const passwordHash = await argon2.hash(password);
    user.password = passwordHash;
    await this.userRepository.save(user);
    // Enviar email de confirmación
//    await this.emailService.sendEmail({
//      to: user.email,
//      subject: 'Contraseña reiniciada exitosamente',
//      template: 'resetPassword',
//      context: {
//        name: user.username
//      }
//    });
    return {
      success: true,
      message: 'Contraseña reiniciada exitosamente'
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const user = await this.userRepository.findOne({ where: [
       { email:email},
       { username:username } 
      ]
      });

    if (user && user.username==username) {
      throw new UnauthorizedException('Usuario ya existe');
    }

    if (user && user.email==email) {
      throw new UnauthorizedException('Email ya existe');
    }

    const passwordHash = await argon2.hash(password);
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = passwordHash;
    newUser.isActive = false;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    // Generar token de registro
    const token = await jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);
    newUser.tokenRegister = token;
    const minutos = parseInt(process.env.TOKEN_EXPIRATION_REGISTER || '30');//si no existe, se usa 15 minutos
    const fecha = new Date(Date.now() + 1000 * 60 * minutos)
    console.log("fecha", fecha);
    newUser.tokenRegisterExpires = fecha; // 24 horas
    await this.userRepository.save(newUser);

    // Enviar email de registro
    await this.emailService.sendEmail({
      to: email,
      subject: 'Registro de usuario',
      template: 'account-confirmation',
      context: {
        username: username, 
        token: token,
        appUrl: process.env.FRONTEND_URL,
        appName: process.env.APP_NAME,
        confirmationUrl: `${process.env.FRONTEND_URL}/auth/register?token=${token}`
      }
    });

    return {
      success: true,
      message: 'Usuario registrado exitosamente'
    };
  }


  async registerConfirm(token: string) {

    //console.log("token", token);
    const user = await this.userRepository.findOne({ where: { tokenRegister: token } });
    console.log("user", user);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.tokenRegisterExpires && user.tokenRegisterExpires < new Date()) {
      throw new UnauthorizedException('Token de registro expirado.');
    }

    user.isActive = true;
    user.tokenRegister = null;
    user.tokenRegisterExpires = null;

    await this.userRepository.save(user);
    return {
      success: true,
      message: 'Usuario confirmado exitosamente'
    };
  }
}
