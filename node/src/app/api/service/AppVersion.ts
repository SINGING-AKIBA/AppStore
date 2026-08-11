import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { AppVersion as AppVersionModel } from "@/app/common/model/AppVersion";

@Provide()
export class AppVersion extends Base {
  @InjectEntityModel(AppVersionModel)
  model: Repository<AppVersionModel>;
  protected selectFields = ["id", "version"];
  protected join: selectJoin[] = [
    {
      type: "left",
      name: "app_info",
    },
  ];
  protected filterWhere() {
    return {
      equal: [
        "app_info_id",
        "version_code",
        "force_update_switch",
        "status",
        "is_delete",
      ],
      like: [
        "version",
        "size",
        "min_os_ios",
        "min_os_android",
        "ios_appstore",
        "platform",
      ],
      between: ["publish_time", "create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
