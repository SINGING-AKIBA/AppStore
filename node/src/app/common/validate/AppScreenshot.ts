import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class AppScreenshot extends Base {
  @Rule(Joi.number().min(0).max(4294967295).required().label("APP ID"))
  @ApiProperty({ description: "APP ID" })
  app_info_id: number;
  @Rule(Joi.string().max(500).uri().required().label("截图图片URL"))
  @ApiProperty({ description: "截图图片URL" })
  image: string;
  @Rule(Joi.any().valid("ios", "android").required().label("适用平台"))
  @ApiProperty({ description: "适用平台:ios=iOS,android=安卓" })
  platform: "ios" | "android";
  @Rule(Joi.number().min(0).max(4294967295).required().label("排序（升序）"))
  @ApiProperty({ description: "排序（升序）" })
  sort_order: number;
}
