import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Menu extends Base {
  @Rule(Joi.number().min(-128).max(127).required().label("类型"))
  @ApiProperty({ description: "类型::10=菜单,20=路由,30=操作" })
  type: number;
  @Rule(Joi.number().min(0).max(4294967295).required().label("父级ID"))
  @ApiProperty({ description: "父级ID" })
  pid: number;
  @Rule(Joi.string().max(150).required().label("名称"))
  @ApiProperty({ description: "名称" })
  title: string;
  @Rule(Joi.string().max(300).required().label("路径地址"))
  @ApiProperty({ description: "路径地址" })
  path: string;
  @Rule(Joi.string().max(300).allow('').label("图标"))
  @ApiProperty({ description: "图标" })
  icon: string;
  @Rule(Joi.number().min(-2147483648).max(2147483647).required().label("排序"))
  @ApiProperty({ description: "排序" })
  weigh: number;
  @Rule(Joi.number().min(-128).max(127).valid(10, 20).required().label("状态"))
  @ApiProperty({ description: "状态:10=显示,20=隐藏" })
  status: number;
  @Rule(
    Joi.number()
      .min(-128)
      .max(127)
      .valid(10, 20, 30, 40)
      .required()
      .label("打开方式")
  )
  @ApiProperty({
    description: "打开方式:10=_self,20=_blank,30=_top,40=_parent",
  })
  target: number;
  @Rule(Joi.number().min(-128).max(127).required().label("10显示20隐藏"))
  @ApiProperty({ description: "10显示20隐藏" })
  show: number;
}
