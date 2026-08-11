import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { UploadsGroup as UploadsGroupModel } from "@/app/common/model/UploadsGroup";

@Provide()
export class UploadsGroup extends Base {
  @InjectEntityModel(UploadsGroupModel)
  model: Repository<UploadsGroupModel>;
  protected selectFields = ["id", "name"];
  protected filterWhere() {
    return {
      equal: ["pid", "sort", "is_delete"],
      like: ["name"],
      between: ["create_time", "update_time"],
      in: ["id"],
    };
  }
}
