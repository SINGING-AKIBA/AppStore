import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { AppInfo as AppInfoService } from "@/app/admin/service/AppInfo";
import { SmileController } from "@/decorator/controller";
import {
  AppInfoIndex,
  AppInfoSave,
  AppInfoUpdate,
  AppInfoDelete,
  AppInfoDetail,
} from "@/app/admin/validate/AppInfo";

@SmileController("/admin/appinfo", { tagName: "admin/APP信息管理" })
export class AppInfo extends Base {
  @Inject()
  service: AppInfoService;

  @Get("/index")
  async index(@Query() query: AppInfoIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: AppInfoSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: AppInfoDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: AppInfoUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: AppInfoDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: AppInfoIndex) {
    this.success(await this.service.select(query));
  }
}
