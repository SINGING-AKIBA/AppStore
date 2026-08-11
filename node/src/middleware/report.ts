import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class RunTime implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      const result = await next();
      const method = ctx.method;
      const url = ctx.url;
      ctx.logger.info(
        `${method} ${url} 请求时间：${Date.now() - startTime}ms`
      );
      return result;
    };
  }

  static getName(): string {
    return 'RunTime';
  }
}
