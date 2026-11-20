import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import dayjs from "dayjs";
import { AnalyticsEvent } from "@/app/common/model/AnalyticsEvent";
import { AppInfo } from "@/app/common/model/AppInfo";

type DateRange = {
  startDate: string;
  endDate: string;
  startTime: number;
  endTime: number;
};

@Provide()
export class Analytics {
  @InjectEntityModel(AnalyticsEvent)
  eventModel: Repository<AnalyticsEvent>;

  @InjectEntityModel(AppInfo)
  appModel: Repository<AppInfo>;

  private resolveRange(query: any = {}): DateRange {
    const end = query.end_date
      ? dayjs(query.end_date).endOf("day")
      : dayjs().endOf("day");
    const start = query.start_date
      ? dayjs(query.start_date).startOf("day")
      : end.subtract(6, "day").startOf("day");

    if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
      throw new Error("统计日期范围无效");
    }

    return {
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
      startTime: start.unix(),
      endTime: end.unix(),
    };
  }

  private eventQuery(range: DateRange) {
    return this.eventModel
      .createQueryBuilder("event")
      .where("event.is_delete = :isDelete", { isDelete: 0 })
      .andWhere("event.create_time >= :startTime", { startTime: range.startTime })
      .andWhere("event.create_time <= :endTime", { endTime: range.endTime });
  }

  async overview(query: any = {}) {
    const range = this.resolveRange(query);
    const [counts, visitors, appCount] = await Promise.all([
      this.eventQuery(range)
        .select("event.event_type", "event_type")
        .addSelect("COUNT(event.id)", "total")
        .groupBy("event.event_type")
        .getRawMany(),
      this.eventQuery(range)
        .select("COUNT(DISTINCT event.visitor_id)", "uv")
        .andWhere("event.event_type = :eventType", { eventType: "page_view" })
        .getRawOne(),
      this.appModel.count({ where: { status: 10, is_delete: 0 } }),
    ]);

    const totals = new Map(counts.map((row: any) => [row.event_type, Number(row.total) || 0]));
    const count = (type: string) => Number(totals.get(type) || 0);

    return {
      date_range: { start_date: range.startDate, end_date: range.endDate },
      app_count: appCount,
      pv: count("page_view"),
      uv: Number(visitors?.uv) || 0,
      detail_views: count("app_detail_view"),
      download_clicks: count("app_download_click"),
      search_count: count("app_search"),
    };
  }

  async trend(query: any = {}) {
    const range = this.resolveRange(query);
    const rows = await this.eventQuery(range)
      .select("DATE_FORMAT(FROM_UNIXTIME(event.create_time), '%Y-%m-%d')", "date")
      .addSelect("SUM(CASE WHEN event.event_type = 'page_view' THEN 1 ELSE 0 END)", "pv")
      .addSelect("COUNT(DISTINCT CASE WHEN event.event_type = 'page_view' THEN event.visitor_id END)", "uv")
      .addSelect("SUM(CASE WHEN event.event_type = 'app_detail_view' THEN 1 ELSE 0 END)", "detail_views")
      .addSelect("SUM(CASE WHEN event.event_type = 'app_download_click' THEN 1 ELSE 0 END)", "download_clicks")
      .addSelect("SUM(CASE WHEN event.event_type = 'app_search' THEN 1 ELSE 0 END)", "search_count")
      .groupBy("date")
      .orderBy("date", "ASC")
      .getRawMany();

    return rows.map((row: any) => ({
      date: row.date,
      pv: Number(row.pv) || 0,
      uv: Number(row.uv) || 0,
      detail_views: Number(row.detail_views) || 0,
      download_clicks: Number(row.download_clicks) || 0,
      search_count: Number(row.search_count) || 0,
    }));
  }

  async appRanking(query: any = {}) {
    const range = this.resolveRange(query);
    const rows = await this.eventQuery(range)
      .leftJoin(AppInfo, "app", "app.id = event.app_info_id")
      .select("event.app_info_id", "app_info_id")
      .addSelect("app.name", "app_name")
      .addSelect("SUM(CASE WHEN event.event_type = 'app_detail_view' THEN 1 ELSE 0 END)", "detail_views")
      .addSelect("SUM(CASE WHEN event.event_type = 'app_download_click' THEN 1 ELSE 0 END)", "download_clicks")
      .andWhere("event.app_info_id IS NOT NULL")
      .groupBy("event.app_info_id")
      .addGroupBy("app.name")
      .orderBy("download_clicks", "DESC")
      .addOrderBy("detail_views", "DESC")
      .limit(20)
      .getRawMany();

    return rows.map((row: any) => {
      const detailViews = Number(row.detail_views) || 0;
      const downloadClicks = Number(row.download_clicks) || 0;
      return {
        app_info_id: Number(row.app_info_id),
        app_name: row.app_name || "应用已删除",
        detail_views: detailViews,
        download_clicks: downloadClicks,
        download_rate: detailViews > 0
          ? Number((downloadClicks / detailViews * 100).toFixed(1))
          : 0,
      };
    });
  }

  async searchKeywords(query: any = {}) {
    const range = this.resolveRange(query);
    const rows = await this.eventQuery(range)
      .select("event.keyword", "keyword")
      .addSelect("COUNT(event.id)", "search_count")
      .addSelect("SUM(CASE WHEN COALESCE(event.result_count, 0) = 0 THEN 1 ELSE 0 END)", "no_result_count")
      .andWhere("event.event_type = :eventType", { eventType: "app_search" })
      .andWhere("event.keyword IS NOT NULL")
      .andWhere("event.keyword <> ''")
      .groupBy("event.keyword")
      .orderBy("search_count", "DESC")
      .limit(20)
      .getRawMany();

    return rows.map((row: any) => ({
      keyword: row.keyword,
      search_count: Number(row.search_count) || 0,
      no_result_count: Number(row.no_result_count) || 0,
    }));
  }

  async sourceStats(query: any = {}) {
    const range = this.resolveRange(query);
    const [sources, platforms] = await Promise.all([
      this.eventQuery(range)
        .select("event.source", "source")
        .addSelect("COUNT(event.id)", "visits")
        .addSelect("COUNT(DISTINCT event.visitor_id)", "uv")
        .andWhere("event.event_type = :eventType", { eventType: "page_view" })
        .groupBy("event.source")
        .orderBy("visits", "DESC")
        .getRawMany(),
      this.eventQuery(range)
        .select("event.platform", "platform")
        .addSelect("event.device_type", "device_type")
        .addSelect("COUNT(event.id)", "visits")
        .addSelect("COUNT(DISTINCT event.visitor_id)", "uv")
        .andWhere("event.event_type = :eventType", { eventType: "page_view" })
        .groupBy("event.platform")
        .addGroupBy("event.device_type")
        .orderBy("visits", "DESC")
        .getRawMany(),
    ]);

    return {
      sources: sources.map((row: any) => ({
        source: row.source || "unknown",
        visits: Number(row.visits) || 0,
        uv: Number(row.uv) || 0,
      })),
      platforms: platforms.map((row: any) => ({
        platform: row.platform || "unknown",
        device_type: row.device_type || "unknown",
        visits: Number(row.visits) || 0,
        uv: Number(row.uv) || 0,
      })),
    };
  }
}
