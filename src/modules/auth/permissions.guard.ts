// permissions.guard.ts
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/modules/auth/permissions.decorator';
import { UserService } from 'src/services/user/user.service';
import { IUserService } from 'src/services/user/user.service.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject('IUserService')
        private readonly usersService: IUserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndMerge<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions.length) return true;
        const request = context.switchToHttp().getRequest();
        const jwtUser = request.user;

        const userFromDb = await this.usersService.findPermissionWithRoleId(jwtUser.id);
        const userPermissions = userFromDb?.role?.rolePermissions
        ?.map(p => p.permission.code) ?? [];

        console.log('User permissions:', userPermissions);
        console.log('Required permissions:', requiredPermissions);

        return requiredPermissions.every((permission) =>
            userPermissions?.includes(permission),
        );
    }
}
