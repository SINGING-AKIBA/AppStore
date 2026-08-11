import { Get, Post, Inject, Query, Body, File, Fields, Controller } from "@midwayjs/core";
import { SmileController } from "@/decorator/controller";
import { Base } from "@/app/common/controller/Base";
import { Settings } from "@/app/admin/service/Settings";
import { UploadMiddleware } from '@midwayjs/busboy';
import { Storage } from "@/app/common/service/Storage";
import { Uploads } from "@/app/api/service/Uploads";
import { QiniuHost } from "@/app/common/enum/QiniuHost";
import { User as UserService } from "@/app/api/service/User";
import _ from 'lodash';
import path from "path";

@SmileController("/api/upload", { tagName: "api/文件上传接口", middleware: [UploadMiddleware] })
export class Upload extends Base {
  @Inject()
  settings: Settings;
  @Inject()
  storage: Storage;
  @Inject()
  uploads: Uploads;
  @Inject()
  user: UserService;
  @Post('/image', { summary: '上传图片' })
  async image(@File() files, @Fields() fields) {
    const status = await this.storage.setUploadFile(files).upload();
    if (status === true) {
      let data = await this.storage.saveFileInfo();
      data['admin_user_id'] = 0;
      data['user_id'] = await this.user.getUserId();
      data['group_id'] = 0;
      data['domain'] = data['domain'] || `${this.ctx.protocol}://${this.ctx.host}`;
      let result = await this.uploads.save(data);
      if (result) {
        result['url'] = `${data['domain']}/${result['path']}`;
      }
      return this.success(result);
    } else {
      return this.error(this.storage.getError());
    }
  }

  @Get('/get_config', { summary: '获取上传配置' })
  async get_config() {
    const config = await this.settings.getConfig('storage_setting');
    const gateways = config.default || 'local';
    const result = { gateways };
    if (gateways === 'qiniu') {
      const region = config[gateways]?.qiniu?.region;
      result['url'] = QiniuHost[region] || QiniuHost.Z0;
    }
    this.success(result);
  }

  @Get('/params', { summary: '获取上传配置参数' })
  async params(@Query() query) {
    const gateways = query.gateways || 'local';
    this.storage.chageEngine(gateways)
    const params = await this.storage.token(query);
    return this.success(params);
  }
  @Post('/callback', { summary: '上传回调' })
  async callback(@Body() body) {
    const data = {
      ...body,
      'admin_user_id': this.ctx.user.id,
      'group_id': body.group_id || 0
    }
    if (!_.isEmpty(body.storage) && body.storage !== 'local') {
      const config = await this.settings.getConfig('storage_setting');
      data['domain'] = config?.gateways[body.storage]?.domain || '';
    }
    if (!_.isEmpty(body.name)) {
      data['ext'] = path.extname(body.name);
    }
    return this.success(await this.uploads.save(data));
  }
}