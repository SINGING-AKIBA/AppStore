import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { AppInfo as AppInfoModel } from "@/app/common/model/AppInfo";
import { AppScreenshot as AppScreenshotModel } from "@/app/common/model/AppScreenshot";
import { AppVersion as AppVersionModel } from "@/app/common/model/AppVersion";
@Provide()
export class AppInfo extends Base {
  @InjectEntityModel(AppInfoModel)
  model: Repository<AppInfoModel>;
  @InjectEntityModel(AppScreenshotModel)
  images: Repository<AppScreenshotModel>;
  @InjectEntityModel(AppVersionModel)
  version: Repository<AppVersionModel>;
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
  async index(query: any) {
    // Public app catalog: expose published apps only and keep curated order stable.
    return super.index({
      ...query,
      status: 10,
      orderBy: { sort_order: "DESC", id: "DESC" },
    }, false);
  }

  async detail(query:any) {
    const detail = await this.model.findOne({
      where: {id: query.id || 1},
    });
    if(!detail){
      throw new Error('没有找到该应用');
    }
    const images = await this.images.find({
      where: {app_info_id: query.id || 1}
    })
    const version = await this.version.find({
      where: {app_info_id: query.id || 1,status: 20,update_type:20}
    })
    detail.app_screenshot =  images;
    detail.app_version =  version;
    return detail;
  }
}
