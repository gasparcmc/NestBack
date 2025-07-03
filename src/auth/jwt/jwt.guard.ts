
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> { 
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('No hay token en la cookie');
    }

    // verificá el token
    try {
      const jwt = require('jsonwebtoken');
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      request.user = payload; // opcional: guardás el usuario
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
