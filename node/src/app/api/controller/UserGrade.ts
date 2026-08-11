import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { UserGrade as UserGradeService } from "@/app/api/service/UserGrade";
import {
  UserGradeIndex,
  UserGradeSave,
  UserGradeUpdate,
  UserGradeDelete,
  UserGradeDetail,
} from "@/app/api/validate/UserGrade";


@SmileController("/api/usergrade", { tagName: "api/会员等级记录" })
export class UserGrade extends Base {
  @Inject()
  service: UserGradeService;

  @Get("/index")
  async index(@Query() query: UserGradeIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: UserGradeSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: UserGradeDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: UserGradeUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: UserGradeDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: UserGradeIndex) {
    this.success(await this.service.select(query));
  }
}
