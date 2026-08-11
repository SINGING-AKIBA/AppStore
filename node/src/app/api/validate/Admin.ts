import { PickDto } from "@midwayjs/validation";
import { Admin } from "@/app/common/validate/Admin";

const filelds: (keyof Admin)[] = [
  "username",
  "password",
  "real_name",
  "is_super",
  "sort",
  "user_id",
];

export class AdminUpdate extends PickDto(Admin, filelds) {}
export class AdminSave extends PickDto(Admin, filelds) {}
export class AdminDelete extends PickDto(Admin, ["id", "ids"]) {}
export class AdminDetail extends PickDto(Admin, ["id"]) {}
export class AdminIndex extends PickDto(Admin, ["page", "pageSize"]) {}
