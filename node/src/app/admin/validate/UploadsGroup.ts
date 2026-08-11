import { PickDto } from "@midwayjs/validation";
import { UploadsGroup } from "@/app/common/validate/UploadsGroup";

const filelds: (keyof UploadsGroup)[] = ["name", "pid", "sort"];

export class UploadsGroupUpdate extends PickDto(UploadsGroup, filelds) {}
export class UploadsGroupSave extends PickDto(UploadsGroup, filelds) {}
export class UploadsGroupDelete extends PickDto(UploadsGroup, ["id", "ids"]) {}
export class UploadsGroupDetail extends PickDto(UploadsGroup, ["id"]) {}
export class UploadsGroupIndex extends PickDto(UploadsGroup, [
  "page",
  "pageSize",
]) {}
