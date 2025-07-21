import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@ejemplo.com'
  })
  to: string;

  @ApiProperty({
    description: 'Asunto del email',
    example: 'Bienvenido a nuestra aplicación'
  })
  subject: string;

  @ApiProperty({
    description: 'Nombre del template a usar (opcional)',
    example: 'welcome',
    required: false
  })
  template?: string;

  @ApiProperty({
    description: 'Variables para el template (opcional)',
    example: { username: 'Juan', company: 'Mi Empresa' },
    required: false
  })
  context?: Record<string, any>;

  @ApiProperty({
    description: 'Contenido HTML personalizado (opcional)',
    example: '<h1>Hola mundo</h1>',
    required: false
  })
  html?: string;
}

export class SendWelcomeEmailDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@ejemplo.com'
  })
  to: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez'
  })
  username: string;
}

export class SendConfirmationEmailDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@ejemplo.com'
  })
  to: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez'
  })
  username: string;

  @ApiProperty({
    description: 'Token de confirmación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;
}

export class SendPasswordResetEmailDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@ejemplo.com'
  })
  to: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez'
  })
  username: string;

  @ApiProperty({
    description: 'Token de recuperación de contraseña',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;
}

export class SendNotificationEmailDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@ejemplo.com'
  })
  to: string;

  @ApiProperty({
    description: 'Asunto de la notificación',
    example: 'Nueva notificación importante'
  })
  subject: string;

  @ApiProperty({
    description: 'Mensaje de la notificación',
    example: 'Tienes una nueva notificación en tu cuenta.'
  })
  message: string;
}

export class SendCustomHtmlEmailDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@ejemplo.com'
  })
  to: string;

  @ApiProperty({
    description: 'Asunto del email',
    example: 'Email personalizado'
  })
  subject: string;

  @ApiProperty({
    description: 'Contenido HTML del email',
    example: '<h1>Hola mundo</h1><p>Este es un email personalizado.</p>'
  })
  html: string;
}

export class EmailResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Email enviado exitosamente'
  })
  message: string;
}

export class TestEmailResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Email de prueba enviado exitosamente'
  })
  message: string;

  @ApiProperty({
    description: 'Email al que se envió la prueba',
    example: 'usuario@ejemplo.com'
  })
  email: string;

  @ApiProperty({
    description: 'Template utilizado',
    example: 'welcome'
  })
  template: string;
} 