import { Body, Inject, Post } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Analytics as AnalyticsService } from "@/app/api/service/Analytics";
import { AnalyticsCollect } from "@/app/api/validate/Analytics";

@SmileController("/api/analytics", { tagName: "api/行为统计" })
export class Analytics extends Base {
  @Inject()
  service: AnalyticsService;

  @Post("/collect")
  async collect(@Body() body: AnalyticsCollect) {
    this.success(await this.service.collect(body));
  }
}
