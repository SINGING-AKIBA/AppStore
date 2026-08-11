import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class SmsRecords extends Base {
  @Rule(Joi.string().max(20).required().label("手机号"))
  @ApiProperty({ description: "手机号" })
  mobile: string;
  @Rule(Joi.string().optional().label("短信内容"))
  @ApiProperty({ description: "短信内容" })
  content: string;
  @Rule(Joi.any().valid(1, 2, 3, 4).required().label("短信类型"))
  @ApiProperty({
    description: "短信类型:1=验证码,2=通知短信,3=营销短信,4=系统消息",
  })
  type: "1" | "2" | "3" | "4";
  @Rule(Joi.any().valid(10, 20, 30).required().label("发送状态"))
  @ApiProperty({ description: "发送状态:10=待发送,20=发送成功,30=发送失败" })
  status: "10" | "20" | "30";
  @Rule(Joi.number().min(0).max(255).valid(0, 1).required().label("是否成功"))
  @ApiProperty({ description: "是否成功:0=失败,1=成功" })
  success_switch: number;
  @Rule(Joi.string().max(100).optional().label("短信模板ID"))
  @ApiProperty({ description: "短信模板ID" })
  templateId: string;
  @Rule(Joi.string().optional().label("返回结果信息"))
  @ApiProperty({ description: "返回结果信息" })
  result_textarea: string;
  @Rule(Joi.number().min(0).max(4294967295).optional().label("用户ID"))
  @ApiProperty({ description: "用户ID" })
  user_id: number;
  @Rule(Joi.number().min(0).max(4294967295).optional().label("短信平台"))
  @ApiProperty({ description: "短信平台" })
  platform: number;
}
