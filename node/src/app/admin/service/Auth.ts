import { Auth as AuthService } from '@/app/common/service/Auth'
import config from "@/app/admin/config";
import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '@/app/common/model/Admin';
import { password_verify,md5 } from '@/app/common/Utils';
import { RedisService } from '@midwayjs/redis';
import { randomUUID } from 'node:crypto';
import type { Context } from '@midwayjs/koa';
@Provide()
export class Auth extends AuthService {
    @Inject()
    ctx:Context;
    
    @Inject()
    redisService: RedisService;
    
    @InjectEntityModel(Admin)
    model: Repository<Admin>;
    getConfig() {
        const options: any = config.jwt;
        const secret = options?.secret;
        const expiresIn = options.sign?.expiresIn;
        return { secret, expiresIn };
    }

    async login(params:any) {
        const user = await this.model.findOne({
            where: { username: params.username },
        });
        if (!user) {
            throw new Error('用户不存在');
        }else if (!password_verify(params.password, user.password)) {
            throw new Error('密码错误');
        }
        if(user.password){
           user.password = '*******';
        }
        
        const data = {
            login_time: Date.now(),
            ip: this.ctx.ip,
            nonce_str: randomUUID(),
        }
        const token = this.getUserToken(data);
        const cacheKey = md5(token.token);
        await this.redisService.set(cacheKey, JSON.stringify(user),'EX', token.expiresIn);
        return { token:token.token, userInfo:user };
    }

    async logout() {
        const parts = this.ctx.get('authorization').trim().split(' ');
        const token = parts[1] || parts[0];
        if(token){
            const cacheKey = md5(token);
            await this.redisService.del(cacheKey);
        }
        return '登出成功';
    }
    
}