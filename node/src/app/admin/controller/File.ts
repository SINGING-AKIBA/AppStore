import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Uploads as UploadsService } from "@/app/admin/service/Uploads";
import { UploadsGroup } from "@/app/admin/service/UploadsGroup";
import {
  UploadsIndex,
  UploadsSave,
  UploadsUpdate,
  UploadsDelete,
  UploadsDetail,
} from "@/app/admin/validate/Uploads";

import { UploadsGroupIndex } from "@/app/admin/validate/UploadsGroup";

@SmileController("/admin/file", { tagName: "admin/文件上传" })
export class File extends Base {
  @Inject()
  service: UploadsService;
  @Inject()
  groupService: UploadsGroup;

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
  @Get("/group")
  async group(@Query() query: UploadsGroupIndex) {
    this.success(await this.groupService.index(query, []));
  }

  @Post("/del_file")
  async del_file(@Body() body: UploadsDelete) {
    this.success(await this.service.delete(body));
  }
  @Post("/edit_file")
  async edit_file(@Body() body) {
    this.success(await this.service.update(body));
  }
  @Post("/add_group")
  async add_group(@Body() body) {
    if (body.id) {
      return this.success(await this.groupService.update(body));
    }
    this.success(await this.groupService.save(body));
  }
  @Post("/del_group")
  async del_group(@Body() body) {
    this.success(await this.groupService.delete(body));
  }
}
