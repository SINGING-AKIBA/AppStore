import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { AppError } from '@/app/common/AppError';

@Middleware()
export class Api implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      try {
        const result = await next();
        return result;
      } catch (e: any) {
        if (e instanceof AppError) {
          ctx.status = e.status;
          return {
            code: e.code,
            message: e.message,
            data: []
          };
        }else{
          return {
            code: 500,
            message: e.message || '系统出小差',
            data: []
          };
        }
      }
    }; 
  }

  static getName(): string {
    return 'Api';
  }
}
