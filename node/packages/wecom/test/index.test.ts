import { createLightApp } from '@midwayjs/mock';
import * as custom from '../src';

describe('/test/index.test.ts', () => {
  it('test component', async () => {
    const app = await createLightApp('', {
      imports: [
        custom
      ]
    });
    const baseService = await app.getApplicationContext().getAsync(custom.BaseService);
    expect(await baseService.getAccessToken()).toEqual('hello world');
  });
});
