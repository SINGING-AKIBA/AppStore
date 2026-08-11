import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class User extends Base {
  @Rule(Joi.string().max(765).required().label("用户昵称"))
  @ApiProperty({ description: "用户昵称" })
  nick_name: string;
  @Rule(Joi.any().valid('0', '1', '2').required().label("性别"))
  @ApiProperty({ description: "性别:0=保密,1=男,2=女" })
  gender: string;
  @Rule(
    Joi.any()
      .valid(
        "H5",
        "APP",
        "MP-WEIXIN",
        "MP-ALIPAY",
        "MP-TOUTIAO",
        "MP-QQ",
        "MP-KUAISHOU"
      )
      .required()
      .label("注册来源")
  )
  @ApiProperty({
    description:
      "注册来源:H5=web,APP=app,MP-WEIXIN=微信小程序,MP-ALIPAY=支付宝小程序,MP-TOUTIAO=抖音小程序,MP-QQ=QQ小程序,MP-KUAISHOU=快手小程序",
  })
  platform: "H5" | "APP" | "MP-WEIXIN" | "MP-TOUTIAO" | "MP-ALIPAY";
  @Rule(Joi.number().min(0).max(4294967295).optional().allow('',null).label("头像图片ID"))
  @ApiProperty({ description: "头像图片ID" })
  avatar_img: number;
  @Rule(Joi.string().max(150).optional().allow('',null).label("国家"))
  @ApiProperty({ description: "国家" })
  country: string;
  @Rule(Joi.string().max(150).optional().allow('',null).label("省份"))
  @ApiProperty({ description: "省份" })
  province: string;
  @Rule(Joi.string().max(150).optional().label("城市"))
  @ApiProperty({ description: "城市" })
  city: string;
  @Rule(Joi.string().optional().allow('',null).label("用户可用余额"))
  @ApiProperty({ description: "用户可用余额" })
  balance: string;
  @Rule(Joi.number().min(0).max(4294967295).optional().label("用户可用K点"))
  @ApiProperty({ description: "用户可用K点" })
  points: number;
  @Rule(Joi.string().max(60).optional().label("用户手机号"))
  @ApiProperty({ description: "用户手机号" })
  mobile: string;
  @Rule(Joi.string().max(80).optional().allow('',null).label("真实姓名"))
  @ApiProperty({ description: "真实姓名" })
  real_name: string;
  @Rule(Joi.number().min(0).max(4294967295).optional().allow('',null).label("会员等级ID"))
  @ApiProperty({ description: "会员等级ID" })
  grade_id: number;
  @Rule(Joi.number().min(0).max(4294967295).optional().allow('',null).label("最后登录时间"))
  @ApiProperty({ description: "最后登录时间" })
  last_login_time: number;
  @Rule(Joi.string().max(120).optional().allow('',null).label("最后登录IP"))
  @ApiProperty({ description: "最后登录IP" })
  last_login_ip: string;
  @Rule(
    Joi.number().min(-128).max(127).valid(10, 20).optional().allow('',null).label("用户状态")
  )
  @ApiProperty({ description: "用户状态:10=正常,20=拉黑" })
  status: number;
  @Rule(Joi.string().optional().allow('',null).label("拉黑原因"))
  @ApiProperty({ description: "拉黑原因" })
  message: string;

  @Rule(Joi.number().min(0).max(4294967295).optional().allow('',null).label("关联学校ID"))
  @ApiProperty({ description: "关联学校ID" })
  schools_id: number;

  @Rule(Joi.number().min(0).max(4294967295).optional().allow('',null).label("关联团队ID"))
  @ApiProperty({ description: "关联团队ID" })
  teams_id: number;
}
