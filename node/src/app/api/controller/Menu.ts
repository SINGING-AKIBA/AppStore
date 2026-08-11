import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { Menu as MenuService } from "@/app/api/service/Menu";
import { SmileController } from "@/decorator/controller";
import {
  MenuIndex,
  MenuSave,
  MenuUpdate,
  MenuDelete,
  MenuDetail,
} from "@/app/api/validate/Menu";

@SmileController("/api/menu", { tagName: "api/菜单表" })
export class Menu extends Base {
  @Inject()
  service: MenuService;

  @Get("/index")
  async index(@Query() query: MenuIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: MenuSave) {
    this.success(await this.service.add(body));
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

  @Get("/select")
  async select(@Query() query: MenuIndex) {
    this.success(await this.service.select(query));
  }
}
