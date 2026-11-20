import { Rule } from "@midwayjs/validation";
import * as Joi from "joi";

export class AnalyticsCollect {
  @Rule(Joi.string().trim().pattern(/^[A-Za-z0-9_-]{12,64}$/).required().label("事件ID"))
  event_id: string;

  @Rule(
    Joi.string()
      .valid("page_view", "app_detail_view", "app_search", "app_download_click")
      .required()
      .label("事件类型")
  )
  event_type: string;

  @Rule(Joi.string().trim().min(8).max(64).required().label("匿名访客标识"))
  visitor_id: string;

  @Rule(Joi.string().trim().min(8).max(64).required().label("访问会话标识"))
  session_id: string;

  @Rule(Joi.number().integer().min(1).optional().allow(null).label("应用ID"))
  app_info_id?: number;

  @Rule(Joi.string().max(32).optional().allow(null, "").label("运行平台"))
  platform?: string;

  @Rule(Joi.string().max(32).optional().allow(null, "").label("设备类型"))
  device_type?: string;

  @Rule(Joi.string().valid("direct", "search", "external", "share", "unknown").optional().allow(null, "").label("访问来源"))
  source?: string;

  @Rule(Joi.string().max(200).optional().allow(null, "").label("搜索关键词"))
  keyword?: string;

  @Rule(Joi.number().integer().min(0).optional().allow(null).label("搜索结果数量"))
  result_count?: number;

  @Rule(Joi.string().max(255).optional().allow(null, "").label("页面路径"))
  page_path?: string;

  @Rule(Joi.string().max(255).optional().allow(null, "").label("来源域名"))
  referrer?: string;
}
