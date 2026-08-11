import { Provide, Inject } from '@midwayjs/core';
import { User as UserServie } from "@/app/common/service/User"
import { User as UserModel } from "@/app/common/model/User"
import { Equal, In, Repository } from "typeorm";
import { InjectEntityModel } from "@midwayjs/typeorm";
import type { Context } from "@midwayjs/koa";
import { Oauth as OauthService } from "@/app/api/service/Oauth"
import { md5 } from '@/app/common/Utils';
import { RedisService } from '@midwayjs/redis';
import { AppError } from '@/app/common/AppError';
import { Uploads } from '@/app/common/model/Uploads';


@Provide()
export class User extends UserServie {
  @InjectEntityModel(UserModel)
  model: Repository<UserModel>;

  @InjectEntityModel(Uploads)
  uploadsModel: Repository<Uploads>;

  @Inject()
  oauth: OauthService;

  protected selectFields = ['id', 'nick_name'];
  protected filterWhere() {
    /**
       "nick_name",
       "gender",
       "platform",
       "avatar_img",
       "country",
       "province",
       "city",
       "balance",
       "points",
       "mobile",
       "real_name",
       "grade_id",
       "last_login_time",
       "last_login_ip",
       "status",
       "schools_id",
       "teams_id",
     ];
     
     */
    return {
      equal: ["schools_id", "status", "is_delete","nick_name","gender",'teams_id','grade_id','platform'],
      like: ["name", "country","city","province",'real_name','mobile'],
      between: ["create_time", "update_time", "delete_time"],
      in: ["id"],
    }
  }

  @Inject()
  ctx: Context;

  @Inject()
  redisService: RedisService;
  async getUser(isForce: boolean = true) {
    return await this.getUserInfo(isForce);
  }
  async getUserId(isForce: boolean = true) {
    if(this.userInfo){
      return this.userInfo.id;
    }else{
      const userInfo = await this.getUserInfo(isForce);
      if(userInfo){
        return userInfo.id;
      }else{
        this.throwError(true,'请先登录');
      }
    }
  }
  async getUserInfo(isForce: boolean = true): Promise<any> {
    const authorization = this.ctx.headers['authorization'];
    if (!authorization) {
      return this.throwError(isForce,'请先登录')
    }
    const parts = authorization.trim().split(' ');
    const token = parts[1] || parts[0];
    if(!token){
      return this.throwError(isForce,'请先登录')
    }
    try{
      const verifyToken = this.oauth.verifySync(token);
      if(!verifyToken){
        return this.throwError(isForce,'请退出登录后重新登录！')
      }
      const cacheKey = md5(token);
      let cacheInfo = await this.redisService.get(cacheKey);
      if(cacheInfo){
        let userInfo = JSON.parse(cacheInfo);
        let user = await this.model.findOne({
          where: {
            id: Equal(userInfo?.id || 0) ,
          }
        });
        if(user){
          this.userInfo = user;
          return userInfo;
        }else{
          return this.throwError(isForce,'没有找到用户信息！')
        }
      }else{
        return this.throwError(isForce,'登录已过过期！请重新登录！')
      }
    }catch(e){
      return this.throwError(isForce,'获取用户信息异常，请重新登录！')
    }
  }

  throwError(isForce = true,message:string='') {
    this.setError(message || '请先登录')
    if(isForce){
      throw new AppError(message || '请先登录',401,401)
    }
    return false
  }

  public async getSchoolsId(){
    if(this.userInfo){
      return this.userInfo.id;
    }else{
      const userInfo = await this.getUserInfo(false);
      if(userInfo){
        return userInfo.schools_id;
      }else{
        return 0
      }
    }
  }

  public async getTeamsId(){
    if(this.userInfo){
      return this.userInfo.teams_id;
    }else{
      const userInfo = await this.getUserInfo(false);
      if(userInfo){
        return userInfo.id;
      }else{
        return 0
      }
    }
  }


  public async detail(param?: any, join?: selectJoin[] | Boolean): Promise<any> {
    const detail = await super.detail(param, join);
    let url = ''
    if(!detail){
      throw new AppError('用户不存在！');
    }else if(detail.avatar_img && detail.avatar_img > 0){
      const file = await this.uploadsModel.findOne({
        where: {
          id: Equal(detail.avatar_img)
        }
      })
      if(file){
        url = file.url;
      }
    }
    const hidenKey = ['password','delete_time','update_time',"create_time",'is_delete'];
    const userInfo: any = {}
    for(const key in detail) {
      if(!hidenKey.includes(key)){
        userInfo[key] = detail[key]
      }
    }
    return {
      ...userInfo,
      url,
    }
  }
}
