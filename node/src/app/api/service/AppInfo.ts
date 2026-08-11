import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { AppInfo as AppInfoModel } from "@/app/common/model/AppInfo";

@Provide()
export class AppInfo extends Base {
  @InjectEntityModel(AppInfoModel)
  model: Repository<AppInfoModel>;
  protected selectFields = ["id", "name"];
  protected join: selectJoin[] = [
    {
      type: "left",
      name: "app_screenshot",
    },
    {
      type: "left",
      name: "app_version",
    },
  ];
  protected filterWhere() {
    return {
      equal: ["rating_count", "status", "sort_order", "is_delete"],
      like: ["name", "app_key", "company", "age_rating", "copyright"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
