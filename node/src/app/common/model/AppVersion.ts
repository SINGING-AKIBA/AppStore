import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { AppInfo } from "./AppInfo";

@Index("uk_app_version", ["app_info_id", "version"], { unique: true })
@Index("idx_app_status", ["app_info_id", "status", "publish_time"], {})
@Index("idx_version_code", ["app_info_id", "version_code"], {})
@Index("idx_publish_time", ["publish_time"], {})
@Entity("smile_app_version", { comment: "版本管理表" })
export class AppVersion extends Base {
  @Column("int", { name: "app_info_id", comment: "APP ID", unsigned: true })
  app_info_id: number;

  @Column("varchar", { name: "version", comment: "版本号", length: 20 })
  version: string;

  @Column("int", {
    name: "version_code",
    nullable: true,
    comment: "内部版本号",
    unsigned: true,
  })
  version_code: number | null;

  @Column("varchar", {
    name: "size",
    nullable: true,
    comment: "安装包大小",
    length: 20,
  })
  size: string | null;

  @Column("varchar", {
    name: "min_os_ios",
    nullable: true,
    comment: "iOS最低支持版本",
    length: 20,
    default: () => "12.0",
  })
  min_os_ios: string | null;

  @Column("varchar", {
    name: "min_os_android",
    nullable: true,
    comment: "Android最低支持版本",
    length: 20,
    default: () => "6.0",
  })
  min_os_android: string | null;

  @Column("varchar", {
    name: "ios_url",
    nullable: true,
    comment: "iOS App Store下载链接",
    length: 500,
  })
  ios_url: string | null;

  @Column("varchar", {
    name: "ios_appstore",
    nullable: true,
    comment: "iOS App Store ID",
    length: 50,
  })
  ios_appstore: string | null;

  @Column("varchar", {
    name: "android_url",
    nullable: true,
    comment: "Android APK下载链接",
    length: 500,
  })
  android_url: string | null;

  @Column("text", {
    name: "changelog",
    nullable: true,
    comment: "更新日志/新特性说明",
  })
  changelog: string | null;

  @Column("tinyint", {
    name: "force_update_switch",
    comment: "强制更新开关:0=非强制,1=强制",
    unsigned: true,
    default: () => "0",
  })
  force_update_switch: number;

  @Column("tinyint", {
    name: "status",
    comment: "状态:10=草稿,20=已发布,30=已回滚",
    unsigned: true,
    default: () => "10",
  })
  status: number;

  @Column("tinyint", {
    name: "update_type",
    comment: "更新类型:10=热更新,20=下载安装包",
    default: () => "10",
  })
  update_type: number;

  @Column("datetime", {
    name: "publish_time",
    nullable: true,
    comment: "发布时间",
  })
  publish_time: Date | null;

  @ManyToOne(() => AppInfo)
  @JoinColumn([{ name: "app_info_id", referencedColumnName: "id" }])
  app_info: AppInfo;
}
