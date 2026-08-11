import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Oauth as OauthModel } from "@/app/common/model/Oauth";

@Provide()
export class Oauth extends Base {
  @InjectEntityModel(OauthModel)
  model: Repository<OauthModel>;
  protected selectFields = ["id", "oauth_type"];
  protected join: selectJoin[] = [];
  protected filterWhere() {
    return {
      equal: ["user_id", "is_delete"],
      like: ["oauth_type"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    };
  }
}
