import { PickDto } from "@midwayjs/validation";
import { UserGrade } from "@/app/common/validate/UserGrade";

const filelds: (keyof UserGrade)[] = [
  "user_id",
  "grade_id",
  "start_time",
  "end_time",
];

export class UserGradeUpdate extends PickDto(UserGrade, filelds) {}
export class UserGradeSave extends PickDto(UserGrade, filelds) {}
export class UserGradeDelete extends PickDto(UserGrade, ["id", "ids"]) {}
export class UserGradeDetail extends PickDto(UserGrade, ["id"]) {}
export class UserGradeIndex extends PickDto(UserGrade, ["page", "pageSize"]) {}
