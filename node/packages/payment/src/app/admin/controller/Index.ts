import { Controller,Get } from "@midwayjs/core";

@Controller("/payment/admin")
export class AdminIndex {
  @Get('/index')
  async index() {
    return 'hello world';
  }
}