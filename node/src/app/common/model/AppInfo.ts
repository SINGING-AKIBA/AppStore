import { Column, Entity, Index, OneToMany } from "typeorm";
import { Base } from "./Base";
import { AppScreenshot } from "./AppScreenshot";
import { AppVersion } from "./AppVersion";

@Index("uk_app_key", ["app_key"], { unique: true })
@Index("idx_status_sort", ["status", "sort_order"], {})
@Entity("smile_app_info", { comment: "APP信息管理" })
export class AppInfo extends Base {
  @Column("varchar", { name: "name", comment: "应用名称", length: 200 })
  name: string;

  @Column("varchar", {
    name: "app_key",
    unique: true,
    comment: "应用唯一标识键",
    length: 100,
  })
  app_key: string;

  @Column("varchar", {
    name: "subtitle",
    nullable: true,
    comment: "副标题/标语",
    length: 300,
  })
  subtitle: string | null;

  @Column("varchar", {
    name: "icon",
    nullable: true,
    comment: "应用图标URL",
    length: 500,
  })
  icon: string | null;

  @Column("varchar", {
    name: "company",
    nullable: true,
    comment: "开发商/公司名称",
    length: 200,
  })
  company: string | null;

  @Column("text", { name: "description", nullable: true, comment: "应用描述" })
  description: string | null;

  @Column("varchar", {
    name: "category",
    nullable: true,
    comment: "分类",
    length: 500,
  })
  category: string | null;

  @Column("varchar", {
    name: "age_rating",
    nullable: true,
    comment: "年龄评级:4+=4+,9+=9+,12+=12+,17+=17+",
    length: 20,
    default: () => "4+",
  })
  age_rating: string | null;

  @Column("decimal", {
    name: "rating",
    comment: "用户评分（0.0-5.0）",
    unsigned: true,
    precision: 2,
    scale: 1,
    default: () => "0.0",
  })
  rating: string;

  @Column("int", {
    name: "rating_count",
    comment: "评分数",
    unsigned: true,
    default: () => "0",
  })
  rating_count: number;

  @Column("varchar", {
    name: "copyright",
    nullable: true,
    comment: "版权信息",
    length: 200,
  })
  copyright: string | null;

  @Column("varchar", {
    name: "privacy_url",
    nullable: true,
    comment: "隐私政策链接",
    length: 500,
  })
  privacy_url: string | null;

  @Column("varchar", {
    name: "terms_url",
    nullable: true,
    comment: "服务条款链接",
    length: 500,
  })
  terms_url: string | null;

  @Column("varchar", {
    name: "support_url",
    nullable: true,
    comment: "联系我们/技术支持链接",
    length: 500,
  })
  support_url: string | null;

  @Column("tinyint", {
    name: "status",
    comment: "状态:10=上架,20=下架",
    unsigned: true,
    default: () => "10",
  })
  status: number;

  @Column("int", {
    name: "sort_order",
    comment: "排序权重",
    unsigned: true,
    default: () => "0",
  })
  sort_order: number;

  @OneToMany(() => AppScreenshot, (app_screenshot) => app_screenshot.app_info, {
    cascade: true,
    lazy: false,
    eager: false,
  })
  app_screenshot: AppScreenshot[];

  @OneToMany(() => AppVersion, (app_version) => app_version.app_info, {
    cascade: true,
    lazy: false,
    eager: false,
  })
  app_version: AppVersion[];
}
