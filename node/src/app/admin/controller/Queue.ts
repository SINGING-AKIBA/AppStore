import { Get, Post, Inject, Query, Body, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Queue as QueueService } from "@/app/admin/service/Queue";


@SmileController("/admin/queue", { tagName: "admin/队列管理" })
export class Queue extends Base {
  @Inject()
  service: QueueService;

  @Get("/index")
  async index() {
    this.success(await this.service.getQueues());
  }

  @Get("/jobs")
  async jobs(
    @Query('name') name: string,
    @Query('status') status: string = 'waiting',
    @Query('page') start: number = 0,
    @Query('size') end: number = 15
  ) {
    this.success(await this.service.getJobs(name, status, start, 14));
  }

  @Post("/add")
  async add(
    @Body('name') name: string,
    @Body('data') data: any,
    @Body('options') options?: any
  ) {
    this.success(await this.service.addJob(name, data, options));
  }

  @Post("/update")
  async update(
    @Body('name') name: string,
    @Body('id') id: string,
    @Body('data') data: any
  ) {
    this.success(await this.service.updateJob(name, id, data));
  }

  @Post("/remove")
  async remove(
    @Body('name') name: string,
    @Body('id') id: string
  ) {
    this.success(await this.service.removeJob(name, id));
  }

  @Post("/pause")
  async pause(@Body('name') name: string) {
    this.success(await this.service.pauseQueue(name));
  }

  @Post("/resume")
  async resume(@Body('name') name: string) {
    this.success(await this.service.resumeQueue(name));
  }

  @Post("/clean")
  async clean(
    @Body('name') name: string,
    @Body('status') status: string,
    @Body('grace') grace: number = 5000,
    @Body('limit') limit: number = 100
  ) {
    this.success(await this.service.clean(name, status, grace, limit));
  }

  @Post("/retry")
  async retry(
    @Body('name') name: string,
    @Body('id') id: string
  ) {
    this.success(await this.service.retryJob(name, id));
  }

  @Get("/progress")
  async progress(
    @Query('name') name: string,
    @Query('id') id: string
  ) {
    this.success(await this.service.getJobProgress(name, id));
  }
}
