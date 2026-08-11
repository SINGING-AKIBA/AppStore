import { Inject, Provide, Init } from "@midwayjs/core";
import { Local } from "@/app/common/service/storage/Local";
import { Qcloud } from "@/app/common/service/storage/Qcloud";
import { Qiniu } from "@/app/common/service/storage/Qiniu";
import { Aliyun } from "@/app/common/service/storage/Aliyun";
import { Settings } from './Settings';
import path from 'path';
import _ from 'lodash';

@Provide()
export class Storage {
    @Inject()
    settings: Settings;

    @Inject()
    appDir;

    protected engine;
    protected ENGINE_LIST = {
        local: Local,
        qiniu: Qiniu,
        aliyun: Aliyun,
        qcloud: Qcloud
    }
    @Init()
    async init() {
        await this.chageEngine();
    }
    public async chageEngine(storage: string = '') {
        const config = await this.settings.getConfig('storage_setting');
        const gateways = _.isEmpty(storage) ? config.default : storage;
        this.setEngine(gateways);
        const conf = config.gateways && config.gateways[gateways] ? config.gateways[gateways] : {};
        if (this.engine) {
            this.setConfig(conf);
            // 为了格式统一 本地：静态目录为public oss是 /
           if(gateways === 'local'){
                this.setDisk(path.join(this.appDir,'public'));
           }
            
        }
    }

    public async upload() {
        return await this.engine.upload();
    }
    public async token(params: any) {
        return await this.engine.token(params);
    }
    public async saveFileInfo() {
        return await this.engine.saveFileInfo()
    }
    public setSaveRole(role: string) {
        this.engine.setSaveRole(role)
        return this;
    }
    public setDisk(disk: string) {
        this.engine.setDisk(disk);
        return this;
    }
    /** 为了兼容php 暂时不要用 */
    public setValidateScene(scene: string) {
        this.engine.setValidateScene(scene);
        return this;
    }

    public setUploadFile(fileName: string) {
        this.engine.setUploadFile(fileName);
        return this;
    }
    public setUploadFileByLocal(filePath: string) {
        this.engine.setUploadFileByLocal(filePath);
        return this;
    }
    public async delete(filePath: string) {
        return await this.engine.delete(filePath)
    }

    protected setEngine(engine: string) {
        if (this.ENGINE_LIST[engine]) {
            this.engine = new this.ENGINE_LIST[engine]()
        } else {
            throw new Error('暂不支持该存储引擎' + engine)
        }
    }
    protected setConfig(config: any) {
        return this.engine.setConfig(config)
    }

    public getError(){
        return this.engine.getError();
    }

}