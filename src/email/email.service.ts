import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envía un email usando un template
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };
      
      await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }

  /**
   * Envía un email de bienvenida
   */
  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: '¡Bienvenido a nuestra aplicación!',
      template: 'welcome',
      context: {
        username,
        appName: 'NestJS App',
      },
    });
  }

  /**
   * Envía un email de confirmación de cuenta
   */
  async sendAccountConfirmationEmail(to: string, token: string, username: string): Promise<void> {
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-account?token=${token}`;
    
    await this.sendEmail({
      to,
      subject: 'Confirma tu cuenta',
      template: 'account-confirmation',
      context: {
        username,
        confirmationUrl,
        appName: 'NestJS App',
      },
    });
  }

  /**
   * Envía un email de recuperación de contraseña
   */
  async sendPasswordResetEmail(to: string, token: string, username: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    await this.sendEmail({
      to,
      subject: 'Recuperación de contraseña',
      template: 'password-reset',
      context: {
        username,
        resetUrl,
        appName: 'NestJS App',
      },
    });
  }

  /**
   * Envía un email de notificación
   */
  async sendNotificationEmail(to: string, subject: string, message: string): Promise<void> {
    await this.sendEmail({
      to,
      subject,
      template: 'notification',
      context: {
        message,
        appName: 'NestJS App',
      },
    });
  }

  /**
   * Envía un email personalizado con HTML
   */
  async sendCustomHtmlEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    await this.sendEmail({
      to,
      subject,
      html: htmlContent,
    });
  }

  /**
   * Envía un email con archivos adjuntos
   */
  async sendEmailWithAttachments(
    to: string,
    subject: string,
    content: string,
    attachments: Array<{
      filename: string;
      content: string | Buffer;
      contentType?: string;
    }>
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject,
      html: content,
      attachments,
    });
  }
}
