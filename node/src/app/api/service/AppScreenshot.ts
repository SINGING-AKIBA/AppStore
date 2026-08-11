import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { AppScreenshot as AppScreenshotModel } from "@/app/common/model/AppScreenshot";

@Provide()
export class AppScreenshot extends Base {
  @InjectEntityModel(AppScreenshotModel)
  model: Repository<AppScreenshotModel>;
  protected selectFields = ["id", "id"];
  protected join: selectJoin[] = [
    {
      type: "left",
      name: "app_info",
    },
  ];
  protected filterWhere() {
    return {
      equal: ["app_info_id", "platform", "sort_order", "is_delete"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
