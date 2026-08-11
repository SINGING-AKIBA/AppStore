import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { Admin as AdminService } from "@/app/api/service/Admin";
import { SmileController } from "@/decorator/controller";
import {
  AdminIndex,
  AdminSave,
  AdminUpdate,
  AdminDelete,
  AdminDetail,
} from "@/app/api/validate/Admin";

@SmileController("/api/admin", { tagName: "api/管理员列表" })
export class Admin extends Base {
  @Inject()
  service: AdminService;

  @Get("/index")
  async index(@Query() query: AdminIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: AdminSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: AdminDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: AdminUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: AdminDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: AdminIndex) {
    this.success(await this.service.select(query));
  }
}
