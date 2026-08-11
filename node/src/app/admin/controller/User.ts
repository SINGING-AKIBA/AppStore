import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { User as UserService } from "@/app/admin/service/User";
import {
  UserIndex,
  UserSave,
  UserUpdate,
  UserDelete,
  UserDetail,
} from "@/app/admin/validate/User";


@SmileController("/admin/user", { tagName: "admin/会员列表" })
export class User extends Base {
  @Inject()
  service: UserService;

  @Get("/index")
  async index(@Query() query: UserIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: UserSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: UserDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: UserUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: UserDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: UserIndex) {
    this.success(await this.service.select(query));
  }
}
