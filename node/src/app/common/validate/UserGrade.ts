import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class UserGrade extends Base {
  @Rule(Joi.number().min(0).max(4294967295).required().label("用户"))
  @ApiProperty({ description: "用户" })
  user_id: number;
  @Rule(Joi.number().min(0).max(4294967295).required().label("会员等级"))
  @ApiProperty({ description: "会员等级" })
  grade_id: number;
  @Rule(Joi.number().min(0).max(4294967295).required().label("生效时间"))
  @ApiProperty({ description: "生效时间" })
  start_time: number;
  @Rule(Joi.number().min(0).max(4294967295).required().label("结束时间"))
  @ApiProperty({ description: "结束时间" })
  end_time: number;
}
