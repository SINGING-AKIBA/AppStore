import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Settings as SettingsModel } from "@/app/common/model/Settings";

@Provide()
export class Settings extends Base {
  @InjectEntityModel(SettingsModel)
  model: Repository<SettingsModel>;
  protected selectFields:string[];
  protected filterWhere() {
    
  }
}
