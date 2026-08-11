import { UploadFileInfo } from '@midwayjs/busboy';
import { md5 } from '@/app/common/Utils';
import dayjs from 'dayjs';
import path from 'path';
import _ from 'lodash';
import fs from 'fs';
import { randomUUID } from 'node:crypto';
export abstract class Base {
    protected error: string;
    protected config: any;
    protected disk = '';//本地是磁盘(E:\)，OSS 是 bucket
    protected saveRole = 'uniqid';
    protected file;
    protected saveDirname = 'storage';
    protected savePath;
    protected validateScene;
    public abstract upload();
    public abstract saveFileInfo();
    public abstract delete(filePath: string);
    public abstract token(params:any);

    public setConfig(config: any) {
        this.config = config;
        return this;
    }
    public setUploadFile(files: UploadFileInfo) {
        let info = files;
        if(info.data){
            info['size'] = fs.statSync(info.data).size;
        }
        this.file = info;
    }
    public setUploadFileByLocal(filePath: string) {
        try{
            this.file = {
                data: filePath,
                filename: path.basename(filePath),
                fileName: path.basename(filePath),
                mimeType: '',
                size: fs.statSync(filePath).size,
            }
            return this;
        } catch (error) {
            this.setError(error.message);
            return false
        }

    }
    public setSaveRole(role: string) {
        this.saveRole = role;
        return this;
    }
    public setDisk(disk: string) {
        this.disk = disk;
        return this;
    }
    public setValidateScene(scene: string) {
        this.validateScene = scene;
        return this;
    }
    protected validate() {
        return true;
    }
    protected async getSavePath() {
        let baseName = '';
        switch (this.saveRole) {
            case 'date':
                baseName = dayjs().valueOf().toString();
                break;
            case 'uniqid': {
                baseName = randomUUID();
                break;
            }
            case 'md5':
                baseName = md5(_.uniqueId());
                break;
            default:
                baseName = dayjs().unix().toString();
        }
        const ext = this.file ? path.extname(this.file.filename) : '';
        const dateDir = dayjs().format('YYYYMMDD');
        const relativeFilePath = path.posix.join(this.saveDirname,dateDir, baseName + ext);
        return {
            savePath: relativeFilePath,
            ext,
        };

    }
    protected getError(): string {
        return this.error;
    }
    protected setError(error: string) {
        this.error = error;
    }

}