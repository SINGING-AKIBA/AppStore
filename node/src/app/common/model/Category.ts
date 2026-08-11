import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "./Base";
import { Uploads } from "./Uploads";

@Entity("smile_category", { comment: "分类管理" })
export class Category extends Base {
  @Column("varchar", { name: "name", comment: "名称", length: 90 })
  name: string;

  @Column("int", {
    name: "pid",
    comment: "上级ID",
    unsigned: true,
    default: () => "0",
  })
  pid: number;

  @Column("int", { name: "sort", comment: "排序", unsigned: true })
  sort: number;

  @Column("int", { name: "icon", nullable: true, comment: "图标" })
  icon: number | null;

  @OneToOne(() => Uploads, (Uploads) => Uploads.id)
  @JoinColumn([{ name: "icon", referencedColumnName: "id" }])
  iconList: Uploads;
}
