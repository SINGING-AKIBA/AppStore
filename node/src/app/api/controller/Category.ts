import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Category as CategoryService } from "@/app/api/service/Category";
import {
  CategoryIndex,
  CategorySave,
  CategoryUpdate,
  CategoryDelete,
  CategoryDetail,
} from "@/app/api/validate/Category";


@SmileController("/api/category", { tagName: "api/分类管理" })
export class Category extends Base {
  @Inject()
  service: CategoryService;

  @Get("/index")
  async index(@Query() query: CategoryIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: CategorySave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: CategoryDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: CategoryUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: CategoryDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: CategoryIndex) {
    this.success(await this.service.select(query));
  }
}
