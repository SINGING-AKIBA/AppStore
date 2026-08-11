import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { AppVersion as AppVersionService } from "@/app/api/service/AppVersion";
import { SmileController } from "@/decorator/controller";
import {
  AppVersionIndex,
  AppVersionSave,
  AppVersionUpdate,
  AppVersionDelete,
  AppVersionDetail,
} from "@/app/api/validate/AppVersion";

@SmileController("/api/appversion", { tagName: "api/版本管理表" })
export class AppVersion extends Base {
  @Inject()
  service: AppVersionService;

  @Get("/index")
  async index(@Query() query: AppVersionIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: AppVersionSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: AppVersionDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: AppVersionUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: AppVersionDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: AppVersionIndex) {
    this.success(await this.service.select(query));
  }
}
