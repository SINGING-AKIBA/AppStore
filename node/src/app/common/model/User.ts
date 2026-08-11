import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Base } from "./Base";
import { Uploads } from "./Uploads";

@Index("nick_name", ["mobile"], {})
@Entity("smile_user", { comment: "会员列表" })
export class User extends Base {
  @Column("varchar", { name: "nick_name", comment: "用户昵称", length: 765 })
  nick_name: string;

  @Column("enum", {
    name: "gender",
    comment: "性别:0=保密,1=男,2=女",
    enum: ["0", "1", "2"],
  })
  gender: "0" | "1" | "2";

  @Column("enum", {
    name: "platform",
    comment:
      "注册来源:H5=web,APP=app,MP-WEIXIN=微信小程序,MP-ALIPAY=支付宝小程序,MP-TOUTIAO=抖音小程序,MP-QQ=QQ小程序,MP-KUAISHOU=快手小程序",
    enum: ["H5", "APP", "MP-WEIXIN", "MP-TOUTIAO", "MP-ALIPAY"],
  })
  platform: "H5" | "APP" | "MP-WEIXIN" | "MP-TOUTIAO" | "MP-ALIPAY";

  @Column("int", {
    name: "avatar_img",
    nullable: true,
    comment: "头像图片ID",
    unsigned: true,
  })
  avatar_img: number | null;

  @Column("varchar", {
    name: "country",
    nullable: true,
    comment: "国家",
    length: 150,
  })
  country: string | null;

  @Column("varchar", {
    name: "province",
    nullable: true,
    comment: "省份",
    length: 150,
  })
  province: string | null;

  @Column("varchar", {
    name: "city",
    nullable: true,
    comment: "城市",
    length: 150,
  })
  city: string | null;

  @Column("decimal", {
    name: "balance",
    nullable: true,
    comment: "用户可用余额",
    unsigned: true,
    precision: 12,
    scale: 2,
  })
  balance: string | null;

  @Column("int", {
    name: "points",
    nullable: true,
    comment: "用户可用K点",
    unsigned: true,
  })
  points: number | null;

  @Column("varchar", {
    name: "mobile",
    nullable: true,
    comment: "用户手机号",
    length: 60,
  })
  mobile: string | null;

  @Column("varchar", {
    name: "real_name",
    nullable: true,
    comment: "真实姓名",
    length: 80,
  })
  real_name: string | null;

  @Column("int", {
    name: "grade_id",
    nullable: true,
    comment: "会员等级ID",
    unsigned: true,
  })
  grade_id: number | null;

  @Column("int", {
    name: "last_login_time",
    nullable: true,
    comment: "最后登录时间",
    unsigned: true,
  })
  last_login_time: number | null;

  @Column("varchar", {
    name: "last_login_ip",
    nullable: true,
    comment: "最后登录IP",
    length: 120,
  })
  last_login_ip: string | null;

  @Column("tinyint", {
    name: "status",
    nullable: true,
    comment: "用户状态:10=正常,20=拉黑",
  })
  status: number | null;

  @Column("text", { name: "message", nullable: true, comment: "拉黑原因" })
  message: string | null;

  @Column("int", {
    name: "schools_id",
    nullable: true,
    comment: "主体",
    unsigned: true,
    default: 0,
  })
  schools_id: number;

  @Column("int", {
    name: "teams_id",
    nullable: true,
    comment: "主体",
    unsigned: true,
    default: 0,
  })
  teams_id: number;
  @Column("varchar", {
    name: "position",
    nullable: true,
    comment: "职位",
    default: ''
  })
  position: string;

  @OneToOne(() => Uploads, (Uploads) => Uploads.id)
  @JoinColumn([{ name: "avatar_img", referencedColumnName: "id" }])
  avatarImgList: Uploads;

}
``