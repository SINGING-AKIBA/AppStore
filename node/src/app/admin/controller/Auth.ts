import { Body, Inject, Post, Get } from '@midwayjs/core';
import { Base } from '@/app/common/controller/Base';
import { SmileController } from '@/decorator/controller';
import { Auth as AutoService } from "@/app/admin/service/Auth";
import { ApiBody } from '@midwayjs/swagger';
import { AdminLogin } from "@/app/admin/validate/Admin"

@SmileController('/admin/auth', { tagName: 'admin/登录' })
export class Auth extends Base {
    @Inject()
    autoService: AutoService;
    @Post('/login')
    async login(@Body() params: AdminLogin) {
        this.success(await this.autoService.login(params))
    }

    @Post('/logout')
    async logout() {
        this.success(await this.autoService.logout());
    }

    @Get('/info')
    async info() {
        this.success(this.ctx.userInfo);
    }
}
