import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Grade extends Base {
  @Rule(Joi.string().max(90).required().label("等级名称"))
  @ApiProperty({ description: "等级名称" })
  name: string;
  @Rule(Joi.string().max(765).optional().allow(null, "").label("等级图标"))
  @ApiProperty({ description: "等级图标" })
  icon_image: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("所需经验值"))
  @ApiProperty({ description: "所需经验值" })
  min_exp_number: number;
  @Rule(Joi.string().optional().allow(null, "").label("权益描述"))
  @ApiProperty({ description: "权益描述" })
  benefit_desc: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("排序"))
  @ApiProperty({ description: "排序" })
  sort_number: number;
  @Rule(Joi.number().min(0).max(255).valid(0, 1).required().label("默认等级"))
  @ApiProperty({ description: "默认等级:0=否,1=是" })
  is_default_switch: number;
  @Rule(Joi.number().min(0).max(255).valid(10, 20).required().label("状态"))
  @ApiProperty({ description: "状态:10=启用,20=禁用" })
  status: number;
}
