import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class AppInfo extends Base {
  @Rule(Joi.string().max(200).required().label("应用名称"))
  @ApiProperty({ description: "应用名称" })
  name: string;
  @Rule(Joi.string().max(100).required().label("应用唯一标识键"))
  @ApiProperty({ description: "应用唯一标识键" })
  app_key: string;
  @Rule(Joi.string().max(300).optional().allow(null, "").label("副标题/标语"))
  @ApiProperty({ description: "副标题/标语" })
  subtitle: string;
  @Rule(
    Joi.string().max(500).uri().optional().allow(null, "").label("应用图标URL")
  )
  @ApiProperty({ description: "应用图标URL" })
  icon: string;
  @Rule(
    Joi.string().max(200).optional().allow(null, "").label("开发商/公司名称")
  )
  @ApiProperty({ description: "开发商/公司名称" })
  company: string;
  @Rule(Joi.string().optional().allow(null, "").label("应用描述"))
  @ApiProperty({ description: "应用描述" })
  description: string;
  @Rule(Joi.string().max(500).optional().allow(null, "").label("分类"))
  @ApiProperty({ description: "分类" })
  category: string;
  @Rule(
    Joi.string()
      .max(20)
      .valid("4+", "9+", "12+", "17+")
      .optional()
      .allow(null, "")
      .label("年龄评级")
  )
  @ApiProperty({ description: "年龄评级:4+=4+,9+=9+,12+=12+,17+=17+" })
  age_rating: string;
  @Rule(Joi.string().required().label("用户评分（0.0-5.0）"))
  @ApiProperty({ description: "用户评分（0.0-5.0）" })
  rating: string;
  @Rule(Joi.number().min(0).max(4294967295).required().label("评分数"))
  @ApiProperty({ description: "评分数" })
  rating_count: number;
  @Rule(Joi.string().max(200).optional().allow(null, "").label("版权信息"))
  @ApiProperty({ description: "版权信息" })
  copyright: string;
  @Rule(Joi.string().max(500).optional().allow(null, "").label("隐私政策链接"))
  @ApiProperty({ description: "隐私政策链接" })
  privacy_url: string;
  @Rule(Joi.string().max(500).optional().allow(null, "").label("服务条款链接"))
  @ApiProperty({ description: "服务条款链接" })
  terms_url: string;
  @Rule(
    Joi.string()
      .max(500)
      .optional()
      .allow(null, "")
      .label("联系我们/技术支持链接")
  )
  @ApiProperty({ description: "联系我们/技术支持链接" })
  support_url: string;
  @Rule(Joi.number().min(0).max(255).valid(10, 20).required().label("状态"))
  @ApiProperty({ description: "状态:10=上架,20=下架" })
  status: number;
  @Rule(Joi.number().min(0).max(4294967295).required().label("排序权重"))
  @ApiProperty({ description: "排序权重" })
  sort_order: number;
}
