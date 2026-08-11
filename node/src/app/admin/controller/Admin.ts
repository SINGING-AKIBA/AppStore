import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Admin as AdminService } from "@/app/admin/service/Admin";
import {
  AdminIndex,
  AdminSave,
  AdminUpdate,
  AdminDelete,
  AdminDetail,
} from "@/app/admin/validate/Admin";

import { CasbinEnforcerService } from '@midwayjs/casbin';

@SmileController("/admin/admin", { tagName: "admin/管理员列表" })
export class Admin extends Base {
  @Inject()
  service: AdminService;

  @Inject()
  casbin: CasbinEnforcerService;

  @Get("/index")
  async index(@Query() query: AdminIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/save")
  async save(@Body() body: AdminSave) {
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
  @Get("/roles")
  async roles() {
    if (this.ctx.user.is_super == 1) {
      this.success(['超级管理员', ...await this.casbin.getAllRoles()]);
    } else {
      this.success(await this.casbin.getRolesForUser(this.ctx.user.username));
    }
  }

  @Post("/settings")
  async settings(@Body() body: any) {
    this.success(await this.service.settings(body));
  }
}
