import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Index("title", ["title"], {})
@Entity("smile_menu", { comment: "菜单表" })
export class Menu extends Base {
  @Column("tinyint", { name: "type", comment: "类型::10=菜单,20=路由,30=操作" })
  type: number;

  @Column("int", { name: "pid", comment: "父级ID", unsigned: true })
  pid: number;

  @Column("varchar", { name: "title", comment: "名称", length: 150 })
  title: string;

  @Column("varchar", { name: "path", comment: "路径地址", length: 300 })
  path: string;

  @Column("varchar", { name: "icon", comment: "图标", length: 300 })
  icon: string;

  @Column("int", { name: "weigh", comment: "排序" })
  weigh: number;

  @Column("tinyint", { name: "status", comment: "状态:10=显示,20=隐藏" })
  status: number;

  @Column("tinyint", {
    name: "target",
    comment: "打开方式:10=_self,20=_blank,30=_top,40=_parent",
  })
  target: number;

  @Column("tinyint", { name: "show", comment: "10显示20隐藏" })
  show: number;
}
