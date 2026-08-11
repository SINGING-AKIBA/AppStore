import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Admin extends Base {
  @Rule(Joi.string().max(765).required().label("用户名"))
  @ApiProperty({ description: "用户名" })
  username: string;
  @Rule(Joi.string().max(765).required().label("登录密码"))
  @ApiProperty({ description: "登录密码" })
  password: string;
  @Rule(Joi.string().max(765).required().label("姓名"))
  @ApiProperty({ description: "姓名" })
  real_name: string;
  @Rule(
    Joi.number().min(0).max(255).label("是否为超级管理员1是0不是")
  )
  @ApiProperty({ description: "是否为超级管理员1是0不是" })
  is_super: number;
  @Rule(
    Joi.number().min(0).max(4294967295).label("排序(数字越小越靠前)")
  )
  @ApiProperty({ description: "排序(数字越小越靠前)" })
  sort: number;
  @Rule(Joi.number().min(-2147483648).max(2147483647).label("用户ID"))
  @ApiProperty({ description: "" })
  user_id: number;
}
