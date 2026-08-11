import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Index("username", ["username"], { unique: true })
@Entity("smile_admin", { comment: "管理员列表" })
export class Admin extends Base {
  @Column("varchar", {
    name: "username",
    unique: true,
    comment: "用户名",
    length: 765,
  })
  username: string;

  @Column("varchar", { name: "password", comment: "登录密码", length: 765 })
  password: string;

  @Column("varchar", { name: "real_name", comment: "姓名", length: 765 })
  real_name: string;

  @Column("tinyint", {
    name: "is_super",
    comment: "是否为超级管理员1是0不是",
    unsigned: true,
  })
  is_super: number;

  @Column("int", {
    name: "sort",
    comment: "排序(数字越小越靠前)",
    unsigned: true,
  })
  sort: number;

  @Column("int", { name: "user_id" })
  user_id: number;
}
