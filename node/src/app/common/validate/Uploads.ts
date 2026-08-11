import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Uploads extends Base {
  @Rule(Joi.number().min(0).max(4294967295).required().label("文件分组ID"))
  @ApiProperty({ description: "文件分组ID" })
  group_id: number;
  @Rule(
    Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("上传来源(10总后台,20商户后台,30客户端)")
  )
  @ApiProperty({ description: "上传来源(10总后台,20商户后台,30客户端)" })
  channel: number;
  @Rule(Joi.string().max(60).required().label("存储方式"))
  @ApiProperty({ description: "存储方式" })
  storage: string;
  @Rule(Joi.string().max(765).required().label("存储域名"))
  @ApiProperty({ description: "存储域名" })
  domain: string;
  @Rule(
    Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("文件类型(10图片 20附件 30视频)")
  )
  @ApiProperty({ description: "文件类型(10图片 20附件 30视频)" })
  type: number;
  @Rule(Joi.string().max(765).required().label("文件名称"))
  @ApiProperty({ description: "文件名称" })
  name: string;
  @Rule(Joi.string().max(765).required().label("文件路径"))
  @ApiProperty({ description: "文件路径" })
  path: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("文件大小(字节)"))
  @ApiProperty({ description: "文件大小(字节)" })
  size: number;
  @Rule(Joi.string().max(60).required().label("文件扩展名"))
  @ApiProperty({ description: "文件扩展名" })
  ext: string;
  @Rule(Joi.string().max(765).required().label("文件封面"))
  @ApiProperty({ description: "文件封面" })
  cover: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("用户ID"))
  @ApiProperty({ description: "用户ID" })
  user_id: number;
  @Rule(
    Joi.number().min(0).max(255).required().label("是否在回收站(0不是10是）")
  )
  @ApiProperty({ description: "是否在回收站(0不是10是）" })
  is_recycle: number;
}
