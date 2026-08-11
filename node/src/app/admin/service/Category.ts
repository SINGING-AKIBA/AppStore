import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Category as CategoryModel } from "@/app/common/model/Category";

@Provide()
export class Category extends Base {
  @InjectEntityModel(CategoryModel)
  model: Repository<CategoryModel>;
  protected selectFields = ["id", "name"];
  protected join: selectJoin[] = [
    {
      type: "left",
      name: "iconList",
    },
  ];
  protected filterWhere() {
    return {
      equal: ["pid", "sort", "icon", "is_delete"],
      like: ["name"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
