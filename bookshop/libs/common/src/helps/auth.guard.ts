import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtAuthenService } from './jwt-authen.service';
import { Reflector } from '@nestjs/core';
import { UserRole } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UserService } from 'apps/bookshop/src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtAuthenService,
    private reflector: Reflector,
    private readonly _userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!token) throw new UnauthorizedException('ไม่ได้รับอนุญาต');
    try {
      const payload = await this.jwtService.decodeJwtToken(token);
      const account = await this._userService.getUserById(payload.id);
      console.log('accc', account);
      if (!account || account.status != 'A') throw new Error();
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('ไม่ได้รับอนุญาต');
    }
    if (
      requiredRoles &&
      !requiredRoles.some((role) => request['user'].role == role)
    )
      throw new ForbiddenException('คุณไม่มีสิทธิ์ในการเข้าถึง');

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
