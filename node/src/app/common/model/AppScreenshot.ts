import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { AppInfo } from "./AppInfo";

@Index("idx_app_platform", ["app_info_id", "platform"], {})
@Index("idx_sort", ["app_info_id", "sort_order"], {})
@Entity("smile_app_screenshot", { comment: "APP截图表" })
export class AppScreenshot extends Base {
  @Column("int", { name: "app_info_id", comment: "APP ID", unsigned: true })
  app_info_id: number;

  @Column("varchar", { name: "image", comment: "截图图片URL", length: 500 })
  image: string;

  @Column("enum", {
    name: "platform",
    comment: "适用平台:ios=iOS,android=安卓",
    enum: ["ios", "android"],
    default: () => "android",
  })
  platform: "ios" | "android";

  @Column("int", {
    name: "sort_order",
    comment: "排序（升序）",
    unsigned: true,
    default: () => "0",
  })
  sort_order: number;

  @ManyToOne(() => AppInfo)
  @JoinColumn([{ name: "app_info_id", referencedColumnName: "id" }])
  app_info: AppInfo;
}
