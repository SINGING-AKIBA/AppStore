import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Index("uk_analytics_event_id", ["event_id"], { unique: true })
@Index("idx_analytics_type_time", ["event_type", "create_time"])
@Index("idx_analytics_app_type_time", ["app_info_id", "event_type", "create_time"])
@Index("idx_analytics_visitor_time", ["visitor_id", "create_time"])
@Index("idx_analytics_keyword_time", ["keyword", "create_time"])
@Entity("smile_analytics_event", { comment: "AppStore匿名行为事件" })
export class AnalyticsEvent extends Base {
  @Column("varchar", { name: "event_id", length: 64, comment: "客户端事件唯一ID" })
  event_id: string;

  @Column("varchar", { name: "event_type", length: 32, comment: "事件类型" })
  event_type: string;

  @Column("int", { name: "app_info_id", unsigned: true, nullable: true, comment: "应用ID" })
  app_info_id: number | null;

  @Column("varchar", { name: "visitor_id", length: 64, comment: "匿名访客标识" })
  visitor_id: string;

  @Column("varchar", { name: "session_id", length: 64, comment: "访问会话标识" })
  session_id: string;

  @Column("varchar", { name: "platform", length: 32, default: "unknown", comment: "运行平台" })
  platform: string;

  @Column("varchar", { name: "device_type", length: 32, default: "unknown", comment: "设备类型" })
  device_type: string;

  @Column("varchar", { name: "source", length: 32, default: "direct", comment: "访问来源" })
  source: string;

  @Column("varchar", { name: "keyword", length: 200, nullable: true, comment: "搜索关键词" })
  keyword: string | null;

  @Column("int", { name: "result_count", unsigned: true, nullable: true, comment: "搜索结果数量" })
  result_count: number | null;

  @Column("varchar", { name: "page_path", length: 255, nullable: true, comment: "页面路径" })
  page_path: string | null;

  @Column("varchar", { name: "referrer", length: 255, nullable: true, comment: "来源域名" })
  referrer: string | null;
}
