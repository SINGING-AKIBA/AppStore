import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Uploads as UploadsService } from "@/app/admin/service/Uploads";
import {
  UploadsIndex,
  UploadsSave,
  UploadsUpdate,
  UploadsDelete,
  UploadsDetail,
} from "@/app/admin/validate/Uploads";


@SmileController("/admin/uploads", { tagName: "admin/文件上传" })
export class Uploads extends Base {
  @Inject()
  service: UploadsService;

  @Get("/index")
  async index(@Query() query: UploadsIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/save")
  async save(@Body() body: UploadsSave) {
    this.success(await this.service.save(body));
  }

  @Get("/detail")
  async detail(@Query() query: UploadsDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: UploadsUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: UploadsDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: UploadsIndex) {
    this.success(await this.service.select(query));
  }
}
