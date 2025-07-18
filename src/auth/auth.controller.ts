import { Body, Controller, Post, Res, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto.login';
import { ApiBody, ApiOperation } from '@nestjs/swagger';  
import { ResetPasswordDto } from './dto/auth.dto.resetPassword';
import { RegisterDto } from './dto/auth.dto.register';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  async create(@Body() loginDto: LoginDto, @Res() res: Response) {  
    try {
      // Validamos usuario y contraseña, si todo sale bien, se genera el token y se procede a configurar la cookie
      const result = await this.authService.login(loginDto);
      
      // Configurar la cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true en producción
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 * 1000, // 30 días en milisegundos
      });

      // Enviar respuesta exitosa
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login exitoso'
      });
      
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message
      });
    }
  }

  @Get('check')
  @ApiOperation({ summary: 'Verificar autenticación del usuario' })
  async checkAuth(@Res() res: Response) {
    try {
      // Obtener el token de la cookie
      const token = res.req.cookies?.token;
      
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'No hay token de autenticación'
        });
      }

      // Verificar el token
      const userData = await this.authService.verifyToken(token);
      
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Token válido',
        user: userData
      });
      
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  }

  @Get('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(@Res() res: Response) {
    // Eliminar la cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout exitoso'
    });
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Reiniciar contraseña' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('forgotPassword')
  @ApiOperation({ summary: 'Olvidé mi contraseña' })
  async forgotPassword(@Query('email') email: string) {
      return this.authService.forgotPassword(email);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('register')
  @ApiOperation({ summary: 'Confirmar registro' })
  async registerConfirm(@Query('token') token: string) {
    return this.authService.registerConfirm(token);
  }
}
