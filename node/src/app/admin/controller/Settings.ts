import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Settings as SettingsService } from "@/app/admin/service/Settings";
import {
  SettingsIndex,
  SettingsSave,
  SettingsUpdate,
  SettingsDelete,
  SettingsDetail,
} from "@/app/admin/validate/Settings";


@SmileController("/admin/settings", { tagName: "admin/系统配置" })
export class Settings extends Base {
  @Inject()
  service: SettingsService;

  @Get("/index")
  async index(@Query() query: SettingsIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/save")
  async save(@Body() body: SettingsSave) {
    const key = body.key;
    const value = body.data;
    this.success(await this.service.setItem(key, value));
  }

  @Post("/detail")
  async detail(@Body() query: SettingsDetail) {
    const key = query.key;
    this.success(await this.service.getItem(key));
  }

  @Post("/update")
  async update(@Body() body: SettingsUpdate) {
    this.success(await this.service.update(body));
  }
}
