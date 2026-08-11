import { PickDto } from "@midwayjs/validation";
import { Settings } from "@/app/common/validate/Settings";

const filelds: (keyof Settings)[] = ["key", "values", "describe"];

export class SettingsUpdate extends PickDto(Settings, filelds) {}
export class SettingsSave extends PickDto(Settings,['key', 'describe', 'data']) {}
export class SettingsDelete extends PickDto(Settings, ["id", "ids"]) {}
export class SettingsDetail extends PickDto(Settings, ["key"]) {}
export class SettingsIndex extends PickDto(Settings, ["page", "pageSize"]) {}
