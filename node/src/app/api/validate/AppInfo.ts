import { PickDto, Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { AppInfo } from "@/app/common/validate/AppInfo";

const filelds: (keyof AppInfo)[] = [
  "name",
  "app_key",
  "subtitle",
  "icon",
  "company",
  "description",
  "category",
  "age_rating",
  "rating",
  "rating_count",
  "copyright",
  "privacy_url",
  "terms_url",
  "support_url",
  "status",
  "sort_order",
];

export class AppInfoUpdate extends PickDto(AppInfo, filelds) {}
export class AppInfoSave extends PickDto(AppInfo, filelds) {}
export class AppInfoDelete extends PickDto(AppInfo, ["id", "ids"]) {}
export class AppInfoDetail extends PickDto(AppInfo, ["id"]) {
  @Rule(Joi.string().max(100).optional().allow(null, "").label("应用唯一标识键"))
  @ApiProperty({ description: "应用唯一标识键" })
  app_key?: string;
}
export class AppInfoIndex extends PickDto(AppInfo, ["page", "pageSize"]) {}
