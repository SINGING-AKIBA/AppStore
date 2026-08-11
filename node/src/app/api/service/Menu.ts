import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Menu as MenuModel } from "@/app/common/model/Menu";

@Provide()
export class Menu extends Base {
  @InjectEntityModel(MenuModel)
  model: Repository<MenuModel>;
  protected selectFields = ["id", "title"];
  protected join: selectJoin[] = [];
  protected filterWhere() {
    return {
      equal: ["type", "pid", "weigh", "status", "target", "show", "is_delete"],
      like: ["title"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
