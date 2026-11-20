import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Settings as SettingsService } from "@/app/api/service/Settings";
import {
  SettingsDetail,
} from "@/app/api/validate/Settings";
import { ApiQuery } from "@midwayjs/swagger";

@SmileController("/api/settings", { tagName: "api/系统配置" })
export class Settings extends Base {
  @Inject()
  service: SettingsService

  @Get("/detail")
  async detail(@Query() query: SettingsDetail) {
    this.success(await this.service.detail(query));
  }

  @Get("/app-store-logo")
  async appStoreLogo() {
    this.success(await this.service.appStoreLogo());
  }

}
