import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class UploadsGroup extends Base {
  @Rule(Joi.string().max(90).required().label("分组名称"))
  @ApiProperty({ description: "分组名称" })
  name: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("上级分组ID"))
  @ApiProperty({ description: "上级分组ID" })
  pid: number;
  @Rule(
    Joi.number().min(0).max(4294967295).required().label("排序(数字越小越靠前)")
  )
  @ApiProperty({ description: "排序(数字越小越靠前)" })
  sort: number;
}
