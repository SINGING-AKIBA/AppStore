import { Get } from '@midwayjs/core';
import { SmileController } from '@/decorator/controller';

@SmileController()
export class Home {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
