import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Grade as GradeService } from "@/app/admin/service/Grade";
import {
  GradeIndex,
  GradeSave,
  GradeUpdate,
  GradeDelete,
  GradeDetail,
} from "@/app/admin/validate/Grade";


@SmileController("/admin/grade", { tagName: "admin/用户等级管理" })
export class Grade extends Base {
  @Inject()
  service: GradeService;

  @Get("/index")
  async index(@Query() query: GradeIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: GradeSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: GradeDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: GradeUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: GradeDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: GradeIndex) {
    this.success(await this.service.select(query));
  }
}
