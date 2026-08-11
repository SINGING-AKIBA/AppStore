import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { SmsRecords as SmsRecordsService } from "@/app/api/service/SmsRecords";
import {
  SmsRecordsIndex,
  SmsRecordsSave,
  SmsRecordsUpdate,
  SmsRecordsDelete,
  SmsRecordsDetail,
} from "@/app/api/validate/SmsRecords";


@SmileController("/api/smsrecords", { tagName: "api/短信发送记录" })
export class SmsRecords extends Base {
  @Inject()
  service: SmsRecordsService;

  @Get("/index")
  async index(@Query() query: SmsRecordsIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body: SmsRecordsSave) {
    this.success(await this.service.add(body));
  }

  @Get("/detail")
  async detail(@Query() query: SmsRecordsDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: SmsRecordsUpdate) {
    this.success(await this.service.update(body));
  }

  @Post("/delete")
  async delete(@Body() body: SmsRecordsDelete) {
    this.success(await this.service.delete(body));
  }

  @Get("/select")
  async select(@Query() query: SmsRecordsIndex) {
    this.success(await this.service.select(query));
  }
}
