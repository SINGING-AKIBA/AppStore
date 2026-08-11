import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Grade as GradeModel } from "@/app/common/model/Grade";

@Provide()
export class Grade extends Base {
  @InjectEntityModel(GradeModel)
  model: Repository<GradeModel>;
  protected selectFields = ["id", "name"];
  protected join: selectJoin[] = [];
  protected filterWhere() {
    return {
      equal: [
        "min_exp_number",
        "sort_number",
        "is_default_switch",
        "status",
        "is_delete",
      ],
      like: ["name"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
