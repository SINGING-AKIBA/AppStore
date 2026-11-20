import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { AnalyticsEvent } from "@/app/common/model/AnalyticsEvent";
import type { AnalyticsCollect } from "@/app/api/validate/Analytics";

@Provide()
export class Analytics {
  @InjectEntityModel(AnalyticsEvent)
  model: Repository<AnalyticsEvent>;

  async collect(input: AnalyticsCollect) {
    const now = Date.now();
    const keyword = typeof input.keyword === "string" ? input.keyword.trim().slice(0, 200) : "";
    // Do not persist obvious personal contact details typed into the search box.
    const safeKeyword = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(keyword)
      || /(?:\+?86)?1[3-9]\d{9}/.test(keyword)
      ? null
      : keyword || null;

    try {
      await this.model.insert({
        event_id: input.event_id.trim(),
        event_type: input.event_type,
        app_info_id: input.app_info_id ? Number(input.app_info_id) : null,
        visitor_id: input.visitor_id.trim(),
        session_id: input.session_id.trim(),
        platform: (input.platform || "unknown").trim().slice(0, 32),
        device_type: (input.device_type || "unknown").trim().slice(0, 32),
        source: input.source || "direct",
        keyword: input.event_type === "app_search" ? safeKeyword : null,
        result_count: input.event_type === "app_search" && input.result_count !== undefined
          ? Number(input.result_count)
          : null,
        page_path: input.page_path ? input.page_path.trim().slice(0, 255) : null,
        referrer: input.referrer ? input.referrer.trim().slice(0, 255) : null,
        create_time: now,
        update_time: now,
        is_delete: 0,
      });

      return { accepted: true, duplicate: false };
    } catch (error: any) {
      const code = error?.code || error?.driverError?.code;
      if (code === "ER_DUP_ENTRY" || code === "SQLITE_CONSTRAINT_UNIQUE") {
        // event_id is unique, so client retries cannot inflate counters.
        return { accepted: true, duplicate: true };
      }
      throw error;
    }
  }
}
