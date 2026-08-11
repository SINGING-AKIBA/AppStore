import { Between, Equal, Like, Repository } from "typeorm";
import { Provide, Inject } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Admin as AdminModel } from "@/app/common/model/Admin";
import { password_hash, password_verify } from "@/app/common/Utils";
import { CasbinEnforcerService } from '@midwayjs/casbin';
import type { Context } from "@midwayjs/koa";
import { User as UserServie } from '@/app/common/service/User';
import _ from 'lodash';
import { RedisService } from '@midwayjs/redis';
import { md5 } from '@/app/common/Utils';

@Provide()
export class Admin extends UserServie {
  @InjectEntityModel(AdminModel)
  model: Repository<AdminModel>;
  protected selectFields: string[];
  @Inject()
  casbin: CasbinEnforcerService;

  @Inject()
  ctx: Context;

  @Inject()
  redis: RedisService;
  protected filterWhere() {
    return {
      equal: ['username', 'real_name', 'id'],
      between: ['create_time', 'update_time'],
    }
  }
  async add(body: any) {
    if (this.ctx.user.is_super == 1 && body.roles.includes('超级管理员')) {
      body['is_super'] = 1;
    } else {
      body['is_super'] = 0;
    }
    body['user_id'] = 0;
    if (body.password !== body.confirm_password) {
      throw new Error('密码不一致');
    }
    body['password'] = password_hash(body.password);
    const row = await this.model.save(body);
    if (row.id) {
      await this.addRoles(row.username, body.roles);
    }
    return row.id;
  }
  async update(body: any) {
    if (this.ctx.user.is_super == 1 && body.roles.includes('超级管理员')) {
      body['is_super'] = 1;
    } else {
      body['is_super'] = 0;
    }
    if (body.password) {
      if (body.password !== body.confirm_password) {
        throw new Error('密码不一致');
      }
      body['password'] = password_hash(body.password);
    }
    const { id, roles } = body;
    delete body.confirm_password;
    delete body.roles;
    delete body.id;
    const row = await this.model.update(id, body);
    if (_.toNumber(row.affected) > 0 && body.is_super == 0) {
      await this.casbin.deleteRolesForUser(body.username);
      await this.addRoles(body.username, roles);
    }
    return _.toNumber(row.affected) > 0;
  }
  protected async addRoles(username: string, roles: string[]) {
    for (const role of roles) {
      await this.casbin.addRoleForUser(username, role);
    }
  }
  async index(params: any) {
    const result = await super.index(params);
    //@ts-ignore
    if (result.data.length > 0) {
      //@ts-ignore
      result.data.forEach(item => {
        delete item.password;
      });
    }
    return result;
  }

  async settings(params: any) {
    /* {
        "old_password": "123456",
        "new_password": "123456",
        "confirm_password": "123456"
    }*/
    if (params.new_password !== params.confirm_password) {
      throw new Error('密码不一致');
    }
    const user = this.ctx.user;
    if (!user) {
      throw new Error('请重新登录，后更改密码');
    }
    const admin = await this.model.findOne({
      where: {
        id: Equal(user.id),
      },
    });
    if (!admin) {
      throw new Error('用户不存在');
    }
    if (!password_verify(params.old_password, admin.password)) {
      throw new Error('旧密码错误');
    }
    admin.password = password_hash(params.new_password);
    const res = await this.model.update(admin.id, admin);
    if (res.affected && res.affected > 0) {
      return true;
    } else {
      throw new Error('修改失败');
    }
  }


  async getUserInfo(isForce: boolean = true): Promise<any> {
    if (this.userInfo) {
      return this.userInfo
    }
    const parts = this.ctx.get('authorization').trim().split(' ');
    const token = parts[1] || parts[0];
    const cache = await this.redis.get(md5(token));
    if (!cache) {
      if (isForce) {
        this.ctx.throw(401, { message: '请重新登录', statusCode: 401 });
        return
      } else {
        this.setError('用户信息异常');
      }
    }
    // @ts-ignore
    const user = JSON.parse(cache);
    this.userInfo = await this.model.findOne({
      where: {
        id: user.id
      },
      select: ['id', 'username', 'real_name', 'is_super', 'sort', 'user_id', 'create_time', 'update_time']
    });
    return this.userInfo;
  }

  async getUserId(): Promise<number> {
    const userInfo = await this.getUserInfo();
    if (userInfo) {
      return userInfo.id;
    } else {
      this.setError('用户信息异常');
      return 0;
    }
  }
}
