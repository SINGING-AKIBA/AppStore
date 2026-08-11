import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { SmsRecords as SmsRecordsModel } from "@/app/common/model/SmsRecords";

@Provide()
export class SmsRecords extends Base {
  @InjectEntityModel(SmsRecordsModel)
  model: Repository<SmsRecordsModel>;
  protected selectFields = ["id", "mobile"];
  protected join: selectJoin[] = [];
  protected filterWhere() {
    return {
      equal: [
        "type",
        "status",
        "success_switch",
        "user_id",
        "platform",
        "is_delete",
      ],
      like: ["mobile", "templateId"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }

  
}
