import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Category extends Base {
  @Rule(Joi.string().max(90).required().label("名称"))
  @ApiProperty({ description: "名称" })
  name: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("上级ID"))
  @ApiProperty({ description: "上级ID" })
  pid: number;
  @Rule(Joi.number().min(0).max(4294967295).required().label("排序"))
  @ApiProperty({ description: "排序" })
  sort: number;
  @Rule(Joi.number().min(-2147483648).max(2147483647).optional().label("图标"))
  @ApiProperty({ description: "图标" })
  icon: number;
}
