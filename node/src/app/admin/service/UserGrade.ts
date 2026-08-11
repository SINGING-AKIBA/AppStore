import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { UserGrade as UserGradeModel } from "@/app/common/model/UserGrade";

@Provide()
export class UserGrade extends Base {
  @InjectEntityModel(UserGradeModel)
  model: Repository<UserGradeModel>;
  protected selectFields = ["id", "id"];
  protected join: selectJoin[] = [];
  protected filterWhere() {
    return {
      equal: ["user_id", "grade_id", "is_delete"],
      between: [
        "start_time",
        "end_time",
        "create_time",
        "update_time",
        "delete_time",
      ],
      in: ["id"],
    };
  }
}
