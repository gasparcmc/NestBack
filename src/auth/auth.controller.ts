import { Body, Controller, Post, Res, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto.login';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  async create(@Body() loginDto: LoginDto, @Res() res: Response) {
    console.log("controller:", loginDto);
    
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

  @Get('logout')
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
}
