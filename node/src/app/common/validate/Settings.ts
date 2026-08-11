import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Settings extends Base {
  @Rule(Joi.string().max(90).required().label("配置标题"))
  @ApiProperty({ description: "配置标题" })
  key: string;
  @Rule(Joi.string().optional().label("配置json数据"))
  @ApiProperty({ description: "配置json数据" })
  values: string;
  @Rule(Joi.string().max(765).optional().label("配置描述"))
  @ApiProperty({ description: "配置描述" })
  describe: string;
  @Rule(Joi.object().optional().label("配置值"))
  @ApiProperty({ description: "配置值" })
  data: string;
}
