import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Index("idx_create_time", ["create_time"], {})
@Index("idx_mobile", ["mobile"], {})
@Index("idx_status", ["status"], {})
@Index("idx_type", ["type"], {})
@Index("idx_user_id", ["user_id"], {})
@Entity("smile_sms_records", { comment: "短信发送记录" })
export class SmsRecords extends Base {
  @Column("varchar", { name: "mobile", comment: "手机号", length: 20 })
  mobile: string;

  @Column("text", { name: "content", nullable: true, comment: "短信内容" })
  content: string | null;

  @Column("enum", {
    name: "type",
    comment: "短信类型:1=验证码,2=通知短信,3=营销短信,4=系统消息",
    enum: ["1", "2", "3", "4"],
  })
  type: "1" | "2" | "3" | "4";

  @Column("enum", {
    name: "status",
    comment: "发送状态:10=待发送,20=发送成功,30=发送失败",
    enum: ["10", "20", "30"],
  })
  status: "10" | "20" | "30";

  @Column("tinyint", {
    name: "success_switch",
    comment: "是否成功:0=失败,1=成功",
    unsigned: true,
    default: () => "0",
  })
  success_switch: number;

  @Column("varchar", {
    name: "templateId",
    nullable: true,
    comment: "短信模板ID",
    length: 100,
  })
  templateId: string | null;

  @Column("text", {
    name: "result_textarea",
    nullable: true,
    comment: "返回结果信息",
  })
  result_textarea: string | null;

  @Column("int", {
    name: "user_id",
    nullable: true,
    comment: "用户ID",
    unsigned: true,
  })
  user_id: number | null;

  @Column("int", {
    name: "platform",
    nullable: true,
    comment: "短信平台",
    unsigned: true,
  })
  platform: number | null;
}
