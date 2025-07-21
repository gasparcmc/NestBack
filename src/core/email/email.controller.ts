import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { EmailService } from './email.service';
import {
  SendEmailDto,
  SendWelcomeEmailDto,
  SendConfirmationEmailDto,
  SendPasswordResetEmailDto,
  SendNotificationEmailDto,
  SendCustomHtmlEmailDto,
  EmailResponseDto,
  TestEmailResponseDto
} from './dto/email.dto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ 
    summary: 'Enviar email personalizado',
    description: 'Envía un email personalizado usando templates o HTML personalizado'
  })
  @ApiBody({ type: SendEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email enviado exitosamente',
    type: EmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<EmailResponseDto> {
    await this.emailService.sendEmail(sendEmailDto);
    return { message: 'Email enviado exitosamente' };
  }

  @Post('welcome')
  @ApiOperation({ 
    summary: 'Enviar email de bienvenida',
    description: 'Envía un email de bienvenida usando el template welcome'
  })
  @ApiBody({ type: SendWelcomeEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de bienvenida enviado exitosamente',
    type: EmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendWelcomeEmail(@Body() sendWelcomeEmailDto: SendWelcomeEmailDto): Promise<EmailResponseDto> {
    await this.emailService.sendWelcomeEmail(
      sendWelcomeEmailDto.to,
      sendWelcomeEmailDto.username
    );
    return { message: 'Email de bienvenida enviado exitosamente' };
  }

  @Post('confirmation')
  @ApiOperation({ 
    summary: 'Enviar email de confirmación de cuenta',
    description: 'Envía un email de confirmación de cuenta con token de verificación'
  })
  @ApiBody({ type: SendConfirmationEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de confirmación enviado exitosamente',
    type: EmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendConfirmationEmail(@Body() sendConfirmationEmailDto: SendConfirmationEmailDto): Promise<EmailResponseDto> {
    await this.emailService.sendAccountConfirmationEmail(
      sendConfirmationEmailDto.to,
      sendConfirmationEmailDto.token,
      sendConfirmationEmailDto.username
    );
    return { message: 'Email de confirmación enviado exitosamente' };
  }

  @Post('password-reset')
  @ApiOperation({ 
    summary: 'Enviar email de recuperación de contraseña',
    description: 'Envía un email de recuperación de contraseña con token de reset'
  })
  @ApiBody({ type: SendPasswordResetEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de recuperación de contraseña enviado exitosamente',
    type: EmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendPasswordResetEmail(@Body() sendPasswordResetEmailDto: SendPasswordResetEmailDto): Promise<EmailResponseDto> {
    await this.emailService.sendPasswordResetEmail(
      sendPasswordResetEmailDto.to,
      sendPasswordResetEmailDto.token,
      sendPasswordResetEmailDto.username
    );
    return { message: 'Email de recuperación de contraseña enviado exitosamente' };
  }

  @Post('notification')
  @ApiOperation({ 
    summary: 'Enviar email de notificación',
    description: 'Envía un email de notificación usando el template notification'
  })
  @ApiBody({ type: SendNotificationEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de notificación enviado exitosamente',
    type: EmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendNotificationEmail(@Body() sendNotificationEmailDto: SendNotificationEmailDto): Promise<EmailResponseDto> {
    await this.emailService.sendNotificationEmail(
      sendNotificationEmailDto.to,
      sendNotificationEmailDto.subject,
      sendNotificationEmailDto.message
    );
    return { message: 'Email de notificación enviado exitosamente' };
  }

  @Post('custom-html')
  @ApiOperation({ 
    summary: 'Enviar email con HTML personalizado',
    description: 'Envía un email con contenido HTML completamente personalizado'
  })
  @ApiBody({ type: SendCustomHtmlEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email HTML personalizado enviado exitosamente',
    type: EmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendCustomHtmlEmail(@Body() body: SendCustomHtmlEmailDto): Promise<EmailResponseDto> {
    await this.emailService.sendCustomHtmlEmail(
      body.to,
      body.subject,
      body.html
    );
    return { message: 'Email HTML personalizado enviado exitosamente' };
  }

  @Get('test')
  @ApiOperation({ 
    summary: 'Enviar email de prueba',
    description: 'Envía un email de prueba usando el template welcome para verificar la configuración'
  })
  @ApiQuery({ 
    name: 'email', 
    description: 'Dirección de correo para enviar el email de prueba',
    example: 'usuario@ejemplo.com'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de prueba enviado exitosamente',
    type: TestEmailResponseDto
  })
  @ApiResponse({ status: 400, description: 'Parámetro email requerido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async testEmail(@Query('email') email: string): Promise<TestEmailResponseDto | { error: string }> {
    if (!email) {
      return { error: 'Se requiere el parámetro email' };
    }

    // Enviar un email de prueba
    await this.emailService.sendWelcomeEmail(email, 'Usuario de Prueba');
    
    return { 
      message: 'Email de prueba enviado exitosamente',
      email: email,
      template: 'welcome'
    };
  }
}
