import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Chat as ChatService } from "@/app/common/service/Chat";


@SmileController("/admin/chat", { tagName: "admin/AI客服" })
export class Chat extends Base {
  @Inject()
  service: ChatService;

  @Post("/index")
  async index(@Body() body: any) {
    this.success();
  }
}
