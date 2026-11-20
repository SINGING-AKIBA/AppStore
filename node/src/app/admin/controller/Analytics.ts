import { Get, Inject, Query } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Analytics as AnalyticsService } from "@/app/admin/service/Analytics";

@SmileController("/admin/analytics", { tagName: "admin/数据统计" })
export class Analytics extends Base {
  @Inject()
  service: AnalyticsService;

  @Get("/overview")
  async overview(@Query() query: any) {
    this.success(await this.service.overview(query));
  }

  @Get("/trend")
  async trend(@Query() query: any) {
    this.success(await this.service.trend(query));
  }

  @Get("/app-ranking")
  async appRanking(@Query() query: any) {
    this.success(await this.service.appRanking(query));
  }

  @Get("/search-keywords")
  async searchKeywords(@Query() query: any) {
    this.success(await this.service.searchKeywords(query));
  }

  @Get("/source-stats")
  async sourceStats(@Query() query: any) {
    this.success(await this.service.sourceStats(query));
  }
}
