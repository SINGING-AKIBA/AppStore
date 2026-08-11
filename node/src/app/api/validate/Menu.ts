import { PickDto } from "@midwayjs/validation";
import { Menu } from "@/app/common/validate/Menu";

const filelds: (keyof Menu)[] = [
  "type",
  "pid",
  "title",
  "path",
  "icon",
  "weigh",
  "status",
  "target",
  "show",
];

export class MenuUpdate extends PickDto(Menu, filelds) {}
export class MenuSave extends PickDto(Menu, filelds) {}
export class MenuDelete extends PickDto(Menu, ["id", "ids"]) {}
export class MenuDetail extends PickDto(Menu, ["id"]) {}
export class MenuIndex extends PickDto(Menu, ["page", "pageSize"]) {}
