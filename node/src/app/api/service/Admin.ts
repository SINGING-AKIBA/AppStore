import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Admin as AdminModel } from "@/app/common/model/Admin";

@Provide()
export class Admin extends Base {
  @InjectEntityModel(AdminModel)
  model: Repository<AdminModel>;
  protected selectFields:string[];
  protected filterWhere() {
    
  }
}
