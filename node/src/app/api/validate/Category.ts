import { PickDto } from "@midwayjs/validation";
import { Category } from "@/app/common/validate/Category";

const filelds: (keyof Category)[] = ["name", "pid", "sort", "icon"];

export class CategoryUpdate extends PickDto(Category, filelds) {}
export class CategorySave extends PickDto(Category, filelds) {}
export class CategoryDelete extends PickDto(Category, ["id", "ids"]) {}
export class CategoryDetail extends PickDto(Category, ["id"]) {}
export class CategoryIndex extends PickDto(Category, ["page", "pageSize"]) {}
