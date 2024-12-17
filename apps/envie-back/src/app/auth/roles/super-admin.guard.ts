import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.roles && user.roles.includes('super-admin');
  }
}
