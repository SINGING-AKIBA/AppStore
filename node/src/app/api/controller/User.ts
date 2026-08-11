import { Get, Post, Inject, Query, Body, Config } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { User as UserService } from "@/app/api/service/User";
import {
  UserIndex,
  UserSave,
  UserUpdate,
  UserDelete,
  UserDetail,
} from "@/app/api/validate/User";

@SmileController("/api/user", { tagName: "api/会员列表" })
export class User extends Base {
  @Inject()
  service: UserService;

  @Get("/detail")
  async detail() {
    let params = { id: await this.service.getUserId() }
    const detail = await this.service.detail(params);
    this.success(detail);
  }

  @Post("/update")
  async update(@Body() body: any) {
    let params = { ...body }
    const updateKeys = ["nick_name", "gender", "avatar_img", "country", "province", "city", "real_name", "teams_id", "schools_id", "position"];
    for (let key in params) {
      if (!updateKeys.includes(key)) {
        delete params[key];
      }
    }
    params['id'] = await this.service.getUserId();
    this.success(await this.service.update(params));
  }


  @Get("/select")
  async select(@Query() query: UserIndex) {
    this.success(await this.service.select(query));
  }
}
