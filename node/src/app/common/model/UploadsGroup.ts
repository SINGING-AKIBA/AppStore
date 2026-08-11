import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity("smile_uploads_group", { comment: "文件上传分组" })
export class UploadsGroup extends Base {
  @Column("varchar", { name: "name", comment: "分组名称", length: 90 })
  name: string;

  @Column("int", { name: "pid", comment: "上级分组ID", unsigned: true })
  pid: number;

  @Column("int", {
    name: "sort",
    comment: "排序(数字越小越靠前)",
    unsigned: true,
  })
  sort: number;
}
