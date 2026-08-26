import { PickDto } from "@midwayjs/validation";
import { AppVersion } from "@/app/common/validate/AppVersion";

const filelds: (keyof AppVersion)[] = [
  "app_info_id",
  "version",
  "version_code",
  "size",
  "min_os_ios",
  "min_os_android",
  "ios_url",
  "ios_appstore",
  "android_url",
  "changelog",
  "force_update_switch",
  "status",
  "publish_time",
];

export class AppVersionUpdate extends PickDto(AppVersion, filelds) {}
export class AppVersionSave extends PickDto(AppVersion, filelds) {}
export class AppVersionDelete extends PickDto(AppVersion, ["id", "ids"]) {}
export class AppVersionDetail extends PickDto(AppVersion, ["id"]) {}
export class AppVersionIndex extends PickDto(AppVersion, [
  "page",
  "pageSize",
]) {}
