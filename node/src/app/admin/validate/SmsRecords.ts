import { PickDto } from "@midwayjs/validation";
import { SmsRecords } from "@/app/common/validate/SmsRecords";

const filelds: (keyof SmsRecords)[] = [
  "mobile",
  "content",
  "type",
  "status",
  "success_switch",
  "templateId",
  "result_textarea",
  "user_id",
  "platform",
];

export class SmsRecordsUpdate extends PickDto(SmsRecords, filelds) {}
export class SmsRecordsSave extends PickDto(SmsRecords, filelds) {}
export class SmsRecordsDelete extends PickDto(SmsRecords, ["id", "ids"]) {}
export class SmsRecordsDetail extends PickDto(SmsRecords, ["id"]) {}
export class SmsRecordsIndex extends PickDto(SmsRecords, [
  "page",
  "pageSize",
]) {}
