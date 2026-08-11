import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Uploads as UploadsModel } from "@/app/common/model/Uploads";

@Provide()
export class Uploads extends Base {
  @InjectEntityModel(UploadsModel)
  model: Repository<UploadsModel>;
  protected selectFields = ["id", "storage"];
  protected filterWhere() {
    return {
      equal: [
        "group_id",
        "channel",
        "type",
        "size",
        "user_id",
        "is_recycle",
        "is_delete",
      ],
      like: ["storage", "domain", "name", "path", "ext", "cover"],
      between: ["create_time", "update_time"],
      in: ["id"],
    };
  }

   public async save(param?: any): Promise<any> {
    const imageExts = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif']);
    const videoExts = new Set(['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv']);
    let fileType = 10;
    const ext = param['ext'].substring(1).toLowerCase();
    if (imageExts.has(ext)) {
      fileType = 10;
    } else if (videoExts.has(ext)) {
      fileType = 30;
    }else{
      fileType = 20;
    }
    
    const data = {
      'channel' : 30,
      'storage' : param['storage'],
      'type'    : fileType,
      'name'    : param['name'],
      'path'    : param['savename'],
      'size'    : param['size'],
      'ext'     : param['ext'],
      'cover'   : param['cover'] ?? '',
      'user_id' : param['user_id'],
      'domain'  : param['domain'] ?? '',
      'group_id': param['group_id'] ?? 0
    }
    return await this.model.save(data);
  }
}
