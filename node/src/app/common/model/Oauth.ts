import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity("smile_oauth", { comment: "第三方授权登录" })
export class Oauth extends Base {
  @Column("int", { name: "user_id", comment: "用户ID", unsigned: true })
  user_id: number;

  @Column("varchar", { name: "oauth_type", comment: "第三方名称", length: 90 })
  oauth_type: string;

  @Column("varchar", {
    name: "openid",
    comment: "第三方用户唯一标识",
    length: 765,
  })
  openid: string;

  @Column("varchar", { name: "unionid", comment: "微信unionID", length: 765 })
  unionid: string;
}
