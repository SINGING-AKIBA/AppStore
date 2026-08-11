import { Repository } from "typeorm";
import { Provide,Inject } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Settings as SettingsModel } from "@/app/common/model/Settings";
import { RedisService } from "@midwayjs/redis";

@Provide()
export class Settings extends Base {
  @InjectEntityModel(SettingsModel)
  model: Repository<SettingsModel>;
  @Inject()
  redis: RedisService;
  protected selectFields:string[];
  protected filterWhere() {
    
  }

  cacheKey = "settings:";

  async setItem(key: string, value: string){
    const data = JSON.stringify(value);
    const info = await this.model.findOne({
      where: {key}
    });
    let raw;
    if(info){
      raw = await this.model.update({key}, {values: data});
    }else{
      raw = await this.model.insert({key, values: data});
    }
    if(raw.raw){
      await this.redis.set(this.cacheKey + key, data);
      return true;
    }
    return false;
  }

  async getItem(key: string){
    const data = await this.redis.get(this.cacheKey + key);
    if(data){
      return JSON.parse(data);
    }
    const info = await this.model.findOne({
      where: {key}
    });
    if(info){
      await this.redis.set(this.cacheKey + key, info.values);
      return JSON.parse(info.values);
    }
    return '';
  }
  async getConfig(key: string){
    return await this.getItem(key);
  }
  async setConfig(key: string, value: string){
    return await this.setItem(key, value);
  }
}
