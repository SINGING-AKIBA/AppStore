import { PickDto } from "@midwayjs/validation";
import { Grade } from "@/app/common/validate/Grade";

const filelds: (keyof Grade)[] = [
  "name",
  "icon_image",
  "min_exp_number",
  "benefit_desc",
  "sort_number",
  "is_default_switch",
  "status",
];

export class GradeUpdate extends PickDto(Grade, filelds) {}
export class GradeSave extends PickDto(Grade, filelds) {}
export class GradeDelete extends PickDto(Grade, ["id", "ids"]) {}
export class GradeDetail extends PickDto(Grade, ["id"]) {}
export class GradeIndex extends PickDto(Grade, ["page", "pageSize"]) {}
