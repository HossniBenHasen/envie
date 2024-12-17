import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    // return user && user.roles && user.roles.includes('admin');
    return super.canActivate(context)
  }
}
