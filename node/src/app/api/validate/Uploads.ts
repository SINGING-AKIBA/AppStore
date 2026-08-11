import { PickDto } from "@midwayjs/validation";
import { Uploads } from "@/app/common/validate/Uploads";

const filelds: (keyof Uploads)[] = [
  "group_id",
  "channel",
  "storage",
  "domain",
  "type",
  "name",
  "path",
  "size",
  "ext",
  "cover",
  "user_id",
  "is_recycle",
];

export class UploadsUpdate extends PickDto(Uploads, filelds) {}
export class UploadsSave extends PickDto(Uploads, filelds) {}
export class UploadsDelete extends PickDto(Uploads, ["id", "ids"]) {}
export class UploadsDetail extends PickDto(Uploads, ["id"]) {}
export class UploadsIndex extends PickDto(Uploads, ["page", "pageSize"]) {}
