import { PickDto } from "@midwayjs/validation";
import { Rules } from "@/app/common/validate/Rules";

const filelds: (keyof Rules)[] = [
  "ptype",
  "v0",
  "v1",
  "v2",
  "v3",
  "v4",
  "v5",
  "v6",
];

export class RulesUpdate extends PickDto(Rules, filelds) {}
export class RulesSave extends PickDto(Rules, filelds) {}
export class RulesDelete extends PickDto(Rules, ["id", "ids"]) {}
export class RulesDetail extends PickDto(Rules, ["id"]) {}
export class RulesIndex extends PickDto(Rules, ["page", "pageSize"]) {}
