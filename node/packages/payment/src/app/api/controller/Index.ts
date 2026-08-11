import { Controller,Get } from "@midwayjs/core";

@Controller('/payment/api')
export class ApiIndex {
    @Get('/index')
    async index() {
    return 'hello world';
  }
}