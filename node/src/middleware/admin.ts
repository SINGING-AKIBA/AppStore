import { IMiddleware, Middleware,Inject } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { Auth } from '@/app/admin/service/Auth';
import { CasbinEnforcerService } from '@midwayjs/casbin';
import { Admin as  User } from '@/app/admin/service/Admin';

@Middleware()
export class Admin implements IMiddleware<Context, NextFunction> {
  /**
    * 不需要登陆
    */
  protected publicAction = ['login', 'logout'];
  /**
   * 不需要鉴权
   */
  protected allows = [
    'admin/info',
    'admin/settings',
    'admin/roles',
    'admin/edit',
    'menu/index',
    'statistics/exportData',
  ];

  @Inject()
  casbin: CasbinEnforcerService;
  
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      ctx.logger.info('admin middleware start');
      const path = ctx.URL.pathname;
      const paths = path.split('/');
      const controller = paths[paths.length - 2];
      const action = paths[paths.length - 1];
      if (this.publicAction.includes(action)) {
        return next();
      }
      try {
        if (!ctx.headers['authorization']) {
          return {
            code: 401,
            message: '请先登录',
            data: []
          };
        }
        const parts = ctx.get('authorization').trim().split(' ');
        const token = parts[1] || parts[0];
        if (!token) {
          return {
            code: 401,
            message: '请先登录',
            data: []
          };
        }
        const auth = await ctx.requestContext.getAsync<Auth>(Auth);
        const decode = auth.verifySync(token);
        if(decode){
          const userService = await ctx.requestContext.getAsync<User>(User);
          const userInfo = await userService.getUserInfo();
          ctx.user = userInfo;
          if(this.allows.includes(controller + '/' + action)){
            return next();
          }else if(userInfo.is_super == 1 || this.casbin.enforceSync(userInfo.username, controller, action)){
            return next();
          }
          return {
            code: 403,
            message: '无权限',
            data: []
          };
        }else{
          return {
            code: 401,
            message: '请先登录',
            data: []
          };
        }
      } catch (e: any) {
        return {
          code: 500,
          message: e.message || '系统出小差',
          data: []
        };
      }
    };
  }

  static getName(): string {
    return 'Admin';
  }
}
