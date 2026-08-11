import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { SmsRecords as SmsRecordsService } from "@/app/admin/service/SmsRecords";
import {
  SmsRecordsIndex,
  SmsRecordsSave,
  SmsRecordsUpdate,
  SmsRecordsDelete,
  SmsRecordsDetail,
} from "@/app/admin/validate/SmsRecords";

import { Sms as SmsService } from "@/app/admin/service/Sms";
import _ from "lodash";

@SmileController("/admin/smsrecords", { tagName: "admin/短信发送记录" })
export class SmsRecords extends Base {
  @Inject()
  service: SmsRecordsService;

  @Inject()
  sms: SmsService;

  @Get("/index")
  async index(@Query() query: SmsRecordsIndex) {
    this.success(await this.service.index(query));
  }

  @Post("/add")
  async add(@Body() body) {
    let data = { ...body, templateCode: body.templateId, templateParam: { code: _.random(1000, 9999) } }
    await this.sms.send(data);
    this.success();
  }

  @Get("/detail")
  async detail(@Query() query: SmsRecordsDetail) {
    this.success(await this.service.detail(query));
  }

  @Post("/update")
  async update(@Body() body: SmsRecordsUpdate) {
    this.success();
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
