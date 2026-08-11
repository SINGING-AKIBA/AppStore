import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    //开发环境
    if (process.env.NODE_ENV !== 'production') {
      console.log(err);
    }
    
    // 所有的未分类错误会到这里
    ctx.status = 500;
    ctx.body = {
      code: 500,
      msg: (err.message||'').replace('"','').replace('"',''),
      data: []
    };
    return ctx.body;
  }
}
