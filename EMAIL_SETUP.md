# Configuración del Sistema de Emails

Este proyecto utiliza `@nestjs-modules/mailer` para el envío de emails con templates de Handlebars.

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración del servidor de correo
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-contraseña-de-aplicación
MAIL_FROM=tu-email@gmail.com
MAIL_FROM_NAME=NestJS App

# URL del frontend (para enlaces en emails)
FRONTEND_URL=http://localhost:3000
```

## Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. Habilita la verificación en dos pasos en tu cuenta de Google
2. Genera una "Contraseña de aplicación" en la configuración de seguridad
3. Usa esa contraseña en `MAIL_PASS`

## Otros Proveedores de Email

### Outlook/Hotmail
```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_SECURE=false
```

### SendGrid
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=false
```

### Mailgun
```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_SECURE=false
```

## Endpoints Disponibles

### POST /email/send
Envía un email personalizado:
```json
{
  "to": "destinatario@ejemplo.com",
  "subject": "Asunto del email",
  "template": "welcome",
  "context": {
    "username": "Juan",
    "appName": "Mi App"
  }
}
```

### POST /email/welcome
Envía un email de bienvenida:
```json
{
  "to": "destinatario@ejemplo.com",
  "username": "Juan"
}
```

### POST /email/confirmation
Envía un email de confirmación de cuenta:
```json
{
  "to": "destinatario@ejemplo.com",
  "username": "Juan",
  "token": "token-de-confirmacion"
}
```

### POST /email/password-reset
Envía un email de recuperación de contraseña:
```json
{
  "to": "destinatario@ejemplo.com",
  "username": "Juan",
  "token": "token-de-reset"
}
```

### POST /email/notification
Envía un email de notificación:
```json
{
  "to": "destinatario@ejemplo.com",
  "subject": "Nueva notificación",
  "message": "Contenido de la notificación"
}
```

### POST /email/custom-html
Envía un email con HTML personalizado:
```json
{
  "to": "destinatario@ejemplo.com",
  "subject": "Email personalizado",
  "html": "<h1>Hola</h1><p>Este es un email personalizado</p>"
}
```

### GET /email/test?email=destinatario@ejemplo.com
Envía un email de prueba usando el template de bienvenida.

## Templates Disponibles

- `welcome.hbs` - Email de bienvenida
- `account-confirmation.hbs` - Confirmación de cuenta
- `password-reset.hbs` - Recuperación de contraseña
- `notification.hbs` - Notificaciones generales

## Personalización de Templates

Los templates están ubicados en `src/email/templates/` y usan Handlebars como motor de templates.

Variables disponibles en todos los templates:
- `{{appName}}` - Nombre de la aplicación
- `{{username}}` - Nombre del usuario
- `{{confirmationUrl}}` - URL de confirmación (solo en account-confirmation)
- `{{resetUrl}}` - URL de reset (solo en password-reset)
- `{{message}}` - Mensaje personalizado (solo en notification)

## Uso en Otros Servicios

Para usar el servicio de email en otros módulos:

```typescript
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(private readonly emailService: EmailService) {}

  async registerUser(userData: any) {
    // Lógica de registro...
    
    // Enviar email de bienvenida
    await this.emailService.sendWelcomeEmail(
      userData.email,
      userData.username
    );
  }
}
```

## Solución de Problemas

### Error de autenticación
- Verifica que las credenciales sean correctas
- Asegúrate de usar una contraseña de aplicación si usas Gmail
- Verifica que la verificación en dos pasos esté habilitada

### Error de conexión
- Verifica que el host y puerto sean correctos
- Asegúrate de que el firewall no bloquee la conexión
- Verifica la configuración de `MAIL_SECURE`

### Templates no encontrados
- Verifica que los archivos `.hbs` estén en `src/email/templates/`
- Asegúrate de que los nombres de los templates coincidan exactamente 