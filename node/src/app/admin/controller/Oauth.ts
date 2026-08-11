import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { Oauth as OauthService } from "@/app/admin/service/Oauth";
import { SmileController } from "@/decorator/controller";
import {
  OauthIndex,
  OauthSave,
  OauthUpdate,
  OauthDelete,
  OauthDetail,
} from "@/app/admin/validate/Oauth";

@SmileController("/admin/oauth", { tagName: "admin/第三方授权登录" })
export class Oauth extends Base {
  @Inject()
  service: OauthService;

  @Get("/index")
  async index(@Query() query: OauthIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: OauthSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: OauthDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: OauthUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: OauthDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: OauthIndex) {
    this.success(await this.service.select(query));
  }
}
