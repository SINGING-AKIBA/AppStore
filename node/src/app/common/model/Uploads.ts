import { Column, Entity,AfterLoad, OneToOne,JoinColumn } from "typeorm";
import { Base } from "./Base";
import { UploadsGroup } from "./UploadsGroup";

@Entity("smile_uploads", { comment: "文件上传" })
export class Uploads extends Base {
  @Column("int", {
    name: "group_id",
    comment: "文件分组ID",
    unsigned: true,
    default: () => "0",
  })
  group_id: number;

  @Column("tinyint", {
    name: "channel",
    comment: "上传来源(10总后台,20商户后台,30客户端)",
    unsigned: true,
    default: () => "10",
  })
  channel: number;

  @Column("varchar", { name: "storage", comment: "存储方式", length: 60 })
  storage: string;

  @Column("varchar", { name: "domain", comment: "存储域名", length: 765 })
  domain: string;

  @Column("tinyint", {
    name: "type",
    comment: "文件类型:10=图片,20=附件,30=视频",
    unsigned: true,
  })
  type: number;

  @Column("varchar", { name: "name", comment: "文件名称", length: 765 })
  name: string;

  @Column("varchar", { name: "path", comment: "文件路径", length: 765 })
  path: string;

  @Column("int", { name: "size", comment: "文件大小(字节)", unsigned: true })
  size: number;

  @Column("varchar", { name: "ext", comment: "文件扩展名", length: 60 })
  ext: string;

  @Column("varchar", { name: "cover", comment: "文件封面", length: 765 })
  cover: string;

  @Column("int", {
    name: "user_id",
    comment: "用户ID",
    unsigned: true,
    default: () => "0",
  })
  user_id: number;

  @Column("tinyint", {
    name: "is_recycle",
    comment: "是否在回收站(0不是10是）",
    unsigned: true,
    default: () => "0",
  })
  is_recycle: number;

  @OneToOne(() => UploadsGroup, (group) => group.id)
  @JoinColumn({ name: 'group_id' })
  group: UploadsGroup; 
  url: string;
  cover_url:string;
  @AfterLoad()
  async loadUrl() {
    const domain = this?.domain.endsWith("/") ? this.domain : this?.domain + "/";
    this.url = domain + this?.path;
    this.cover_url = domain + this?.path;
  }
}
