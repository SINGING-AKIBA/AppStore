import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Index("uk_min_exp", ["min_exp_number"], { unique: true })
@Index("idx_status", ["status"], {})
@Entity("smile_grade", { comment: "用户等级管理" })
export class Grade extends Base {
  @Column("varchar", { name: "name", comment: "等级名称", length: 90 })
  name: string;

  @Column("varchar", {
    name: "icon_image",
    nullable: true,
    comment: "等级图标",
    length: 765,
  })
  icon_image: string | null;

  @Column("int", {
    name: "min_exp_number",
    unique: true,
    comment: "所需经验值",
    unsigned: true,
    default: () => "0",
  })
  min_exp_number: number;

  @Column("text", { name: "benefit_desc", nullable: true, comment: "权益描述" })
  benefit_desc: string | null;

  @Column("int", {
    name: "sort_number",
    comment: "排序",
    unsigned: true,
    default: () => "0",
  })
  sort_number: number;

  @Column("tinyint", {
    name: "is_default_switch",
    comment: "默认等级:0=否,1=是",
    unsigned: true,
    default: () => "0",
  })
  is_default_switch: number;

  @Column("tinyint", {
    name: "status",
    comment: "状态:10=启用,20=禁用",
    unsigned: true,
    default: () => "10",
  })
  status: number;
}
