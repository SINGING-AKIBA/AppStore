import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Menu as MenuService } from "@/app/admin/service/Menu";
import {
  MenuIndex,
  MenuSave,
  MenuUpdate,
  MenuDelete,
  MenuDetail,
} from "@/app/admin/validate/Menu";


@SmileController("/admin/menu", { tagName: "admin/菜单表" })
export class Menu extends Base {
  @Inject()
  service: MenuService;

  @Get("/index")
  async index(@Query() query: MenuIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/save")
  async save(@Body() body: MenuSave) {
    this.success(await this.service.save(body));
  }

  @Get("/detail")
  async detail(@Query() query: MenuDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: MenuUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: MenuDelete) {
    this.success(await this.service.delete(body));
  }
}
