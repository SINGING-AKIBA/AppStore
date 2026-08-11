import { Provide,Inject } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
import { User as UserModel } from '@/app/common/model/User';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Base } from "@/app/common/service/Base";
@Provide()
export class User extends Base {
  @InjectEntityModel(UserModel)
  model: Repository<UserModel>;
  @Inject()
  ctx: Context;
  protected selectFields = ['id', 'nick_name'];

  protected join: selectJoin[] = [
    {
      type: "left",
      name: "avatarImgList",
    }
  ];
  protected filterWhere() {
    /**
       "nick_name",
       "gender",
       "platform",
       "avatar_img",
       "country",
       "province",
       "city",
       "balance",
       "points",
       "mobile",
       "real_name",
       "grade_id",
       "last_login_time",
       "last_login_ip",
       "status",
       "schools_id",
       "teams_id",
     ];
     
     */
    return {
      equal: ["schools_id", "status", "is_delete","gender",'teams_id','grade_id','platform'],
      like: ["name", "country","city","province",'real_name','mobile',"nick_name"],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    }
  }
}