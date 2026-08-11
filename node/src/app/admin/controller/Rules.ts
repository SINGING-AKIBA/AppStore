import { Get, Post, Inject, Query, Body } from "@midwayjs/core";
import { Base } from "@/app/common/controller/Base";
import { Rules as RulesService } from "@/app/admin/service/Rules";
import { SmileController } from "@/decorator/controller";
import {
  RulesIndex,
  RulesSave,
  RulesUpdate,
  RulesDelete,
  RulesDetail,
} from "@/app/admin/validate/Rules";

@SmileController("/admin/rules", { tagName: "admin/" })
export class Rules extends Base {
  @Inject()
  service: RulesService;

  @Get("/index")
  async index(@Query() query: RulesIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: RulesSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: RulesDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: RulesUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: RulesDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: RulesIndex) {
    this.success(await this.service.select(query));
  }
}
