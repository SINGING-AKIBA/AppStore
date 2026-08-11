import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { User as UserService } from "@/app/api/service/User";
import { Oauth as OauthService } from "@/app/api/service/Oauth";


@SmileController("/api/oauth", { tagName: "api/用户注册登录" })
export class Oauth extends Base {

    @Inject()
    service: OauthService;


    @Post('/login')
    async login(@Body() body: any) {
        this.success(await this.service.login(body));
    }
    @Get('/logout')
    async logout() {
        this.success(await this.service.logout());
    }

    @Post('/captcha')
    async captcha(@Body() body: any) {
        this.success(await this.service.captcha(body));
    }

    @Get('/agreement')
    async agreement() {
        this.success(await this.service.agreement());
    }

}