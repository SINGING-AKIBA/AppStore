import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { AppVersion as AppVersionModel } from "@/app/common/model/AppVersion";
import crypto from "crypto";

@Provide()
export class AppVersion extends Base {
  @InjectEntityModel(AppVersionModel)
  model: Repository<AppVersionModel>;
  protected selectFields = ["id", "version"];
  protected join: selectJoin[] = [
    /*
    {
      type: "left",
      name: "app_info",
    },*/
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
  /**
   * 
   * @param query 
   * @returns 
   */
  async index(query: any) {
    const result = await super.index(query);
    const { sign, timestamp, nonce } = await this.sign(result.data, query.apiKey);
    return { data: result.data, sign, timestamp, nonce,current_page: result.current_page,per_page: result.per_page,total: result.total,last_page: result.last_page };
  }
  async sign(query: any, apiKey?: string) {
    const stringToSign = query.map((item: any) => {
      return `${item.id}${item.version}${item.version_code}${item.force_update_switch}${item.status}`;
    }).join("");
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    apiKey = apiKey || "default_api_key";
    const sign = crypto.createHash("md5").update(stringToSign+timestamp+nonce+apiKey).digest("hex");
    return { sign, timestamp, nonce };
  }
  //检验签名
  async checkSign(query: any, apiKey?: string ) {
    const sign = query.sign;
    const stringToSign = query.data.map((item: any) => {
      return `${item.id}${item.version}${item.version_code}${item.force_update_switch}${item.status}`;
    }).join("");
    const timestamp = query.timestamp;
    const nonce = query.nonce;
    apiKey = apiKey || "default_api_key";
    const checkSign = crypto.createHash("md5").update(stringToSign+timestamp+nonce+apiKey).digest("hex");
    return sign === checkSign;
  }
}
