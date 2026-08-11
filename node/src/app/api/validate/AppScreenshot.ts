import { PickDto } from "@midwayjs/validation";
import { AppScreenshot } from "@/app/common/validate/AppScreenshot";

const filelds: (keyof AppScreenshot)[] = [
  "app_info_id",
  "image",
  "platform",
  "sort_order",
];

export class AppScreenshotUpdate extends PickDto(AppScreenshot, filelds) {}
export class AppScreenshotSave extends PickDto(AppScreenshot, filelds) {}
export class AppScreenshotDelete extends PickDto(AppScreenshot, [
  "id",
  "ids",
]) {}
export class AppScreenshotDetail extends PickDto(AppScreenshot, ["id"]) {}
export class AppScreenshotIndex extends PickDto(AppScreenshot, [
  "page",
  "pageSize",
]) {}
