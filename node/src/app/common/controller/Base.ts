import { Inject } from '@midwayjs/core';
import type { Context } from '@midwayjs/koa';
export abstract class Base {
    @Inject()
    ctx: Context;
    protected success(data: any[] | object | string | number | boolean = [], msg: string = 'success', code: number = 200) {
        if(typeof data === 'string' && msg === 'success'){
            msg = data;
            data = [];
        }
        this.ctx.body = {
            code,
            msg,
            data
        };
        this.ctx.status = code;
    }
    
    protected error(msg: string, data: any[] | object | string | number | boolean = [], code: number = 500) {
        this.ctx.body = {
            code,
            msg,
            data
        };
        this.ctx.status = code;
    }
}