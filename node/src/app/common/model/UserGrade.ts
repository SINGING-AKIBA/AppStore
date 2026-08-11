import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity("smile_user_grade", { comment: "会员等级记录" })
export class UserGrade extends Base {
  @Column("int", { name: "user_id", comment: "用户", unsigned: true })
  user_id: number;

  @Column("int", { name: "grade_id", comment: "会员等级", unsigned: true })
  grade_id: number;

  @Column("int", { name: "start_time", comment: "生效时间", unsigned: true })
  start_time: number;

  @Column("int", { name: "end_time", comment: "结束时间", unsigned: true })
  end_time: number;
}
