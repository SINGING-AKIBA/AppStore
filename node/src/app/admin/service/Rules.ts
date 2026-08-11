import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Rules as RulesModel } from "@/app/common/model/Rules";

@Provide()
export class Rules extends Base {
  @InjectEntityModel(RulesModel)
  model: Repository<RulesModel>;
  protected selectFields = ["id", "id"];
  protected join: selectJoin[] = [];
  protected filterWhere() {
    return {
      in: ["id"],
    };
  }
}
