import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { UploadsGroup as UploadsGroupService } from "@/app/api/service/UploadsGroup";
import {
  UploadsGroupIndex,
  UploadsGroupSave,
  UploadsGroupUpdate,
  UploadsGroupDelete,
  UploadsGroupDetail,
} from "@/app/api/validate/UploadsGroup";


@SmileController("/api/uploadsgroup", { tagName: "api/文件上传分组" })
export class UploadsGroup extends Base {
  @Inject()
  service: UploadsGroupService;

  @Get("/index")
  async index(@Query() query: UploadsGroupIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/save")
  async save(@Body() body: UploadsGroupSave) {
    this.success(await this.service.save(body));
  }

  @Get("/detail")
  async detail(@Query() query: UploadsGroupDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: UploadsGroupUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: UploadsGroupDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: UploadsGroupIndex) {
    this.success(await this.service.select(query));
  }
}
