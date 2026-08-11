import { PickDto } from "@midwayjs/validation";
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
export class AppInfoDetail extends PickDto(AppInfo, ["id"]) {}
export class AppInfoIndex extends PickDto(AppInfo, ["page", "pageSize"]) {}
