import { PickDto } from "@midwayjs/validation";
import { User } from "@/app/common/validate/User";

const filelds: (keyof User)[] = [
  "nick_name",
  "gender",
  "platform",
  "avatar_img",
  "country",
  "province",
  "city",
  "balance",
  "points",
  "mobile",
  "real_name",
  "grade_id",
  "last_login_time",
  "last_login_ip",
  "status",
  "message",
  "schools_id",
  "teams_id",
];

export class UserUpdate extends PickDto(User, filelds) {}
export class UserSave extends PickDto(User, filelds) {}
export class UserDelete extends PickDto(User, ["id", "ids"]) {}
export class UserDetail extends PickDto(User, ["id"]) {}
export class UserIndex extends PickDto(User, ["page", "pageSize"]) {}
