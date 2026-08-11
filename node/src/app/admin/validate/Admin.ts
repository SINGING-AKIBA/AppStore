import { PickDto } from "@midwayjs/validation";
import { Admin } from "@/app/common/validate/Admin";
import * as Joi from "joi";
import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";

const filelds: (keyof Admin)[] = [
  "username",
  "password",
  "real_name",
  "is_super",
  "sort",
  "user_id",
];

export class AdminUpdate extends PickDto(Admin, ["id","real_name", "sort","username"]) {
  @Rule(Joi.array().items(Joi.string()).required().label("角色"))
  @ApiProperty({ description: "角色" })
  roles: string[];
}
export class AdminSave extends PickDto(Admin, filelds) {}
export class AdminDelete extends PickDto(Admin, ["id", "ids"]) {}
export class AdminDetail extends PickDto(Admin, ["id"]) {}

export class AdminIndex extends PickDto(Admin, ["page", "pageSize"]) {}

export class AdminLogin extends PickDto(Admin, ["username", "password"]) {}