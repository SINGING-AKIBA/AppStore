import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Oauth extends Base {
  @Rule(Joi.number().min(0).max(4294967295).required().label("用户ID"))
  @ApiProperty({ description: "用户ID" })
  user_id: number;
  @Rule(Joi.string().max(90).required().label("第三方名称"))
  @ApiProperty({ description: "第三方名称" })
  oauth_type: string;
  @Rule(Joi.string().max(765).required().label("第三方用户唯一标识"))
  @ApiProperty({ description: "第三方用户唯一标识" })
  openid: string;
  @Rule(Joi.string().max(765).required().label("微信unionID"))
  @ApiProperty({ description: "微信unionID" })
  unionid: string;
}
