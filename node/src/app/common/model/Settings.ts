import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Index("key", ["key"], { unique: true })
@Entity("smile_settings", { comment: "系统配置" })
export class Settings extends Base {
  @Column("varchar", { name: "key", comment: "配置标题", length: 90 })
  key: string;

  @Column("mediumtext", {
    name: "values",
    nullable: true,
    comment: "配置json数据",
  })
  values: string | null;

  @Column("varchar", {
    name: "describe",
    nullable: true,
    comment: "配置描述",
    length: 765,
  })
  describe: string | null;
}
