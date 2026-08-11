import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { AppScreenshot as AppScreenshotService } from "@/app/api/service/AppScreenshot";
import { SmileController } from "@/decorator/controller";
import {
  AppScreenshotIndex,
  AppScreenshotSave,
  AppScreenshotUpdate,
  AppScreenshotDelete,
  AppScreenshotDetail,
} from "@/app/api/validate/AppScreenshot";

@SmileController("/api/appscreenshot", { tagName: "api/APP截图表" })
export class AppScreenshot extends Base {
  @Inject()
  service: AppScreenshotService;

  @Get("/index")
  async index(@Query() query: AppScreenshotIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: AppScreenshotSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: AppScreenshotDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: AppScreenshotUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: AppScreenshotDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: AppScreenshotIndex) {
    this.success(await this.service.select(query));
  }
}
