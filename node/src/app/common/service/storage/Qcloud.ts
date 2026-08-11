import COS = require('cos-nodejs-sdk-v5');
import { Base } from './Base';
import path from 'path';
import _ from 'lodash';


export class Qcloud extends Base {
    private cosClient: COS;
    constructor() {
        super();
    }
    public async delete(filePath: string) {
        const client = await this.getClient();
        try {
            const result = await client.deleteObject({
                Bucket: this.config.bucket,
                Region: this.config.region,
                Key: filePath
            });
            //@ts-ignore
            if (_.isEmpty(result?.Deleted)) {
                this.setError('文件删除失败');
                return false;
            }
            return true;
        } catch (error) {
            this.setError(error.message);
            return false;
        }

    }
    protected async getClient() {
        if (_.isEmpty(this.cosClient)) {
            this.cosClient = new COS({
                SecretId: this.config.secret_id,
                SecretKey: this.config.secret_key
            });
        }
        return this.cosClient;
    }
    public async saveFileInfo() {
        return {
            name: this.file.filename,
            size: this.file.size,
            ext: path.extname(this.file.filename),
            md5: '',
            sha1: '',
            savename: this.savePath.replace(/\\/g, '/'),
            storage: 'qcloud',
            domain: this.config.domain,
        };
    }
    public async token(params: any) {

        const {savePath} = await this.getSavePath();
        const headers = {
            "Content-Type": params.contentType || "multipart/form-data"
        }
        const client = await this.getClient();
        const options = {
            Bucket: this.config.bucket,
            Region: this.config.region,
            Key: savePath,
            Method: 'PUT' as COS.Method,
            Expires: 3600,
            Sign: true,
            headers: headers
        }
        const url = await client.getObjectUrl(options)
        return {
            url,
            key: savePath
        }

    }
    public async upload() {
        // 生成保存路径
        const {savePath} = await this.getSavePath();
        const client = await this.getClient();
        try {
            const result = await client.uploadFile({
                Bucket: this.config.bucket,
                Region: this.config.region,
                Key: savePath,
                FilePath: this.file.data
            })
            if(result.Location){
                return true;
            }
            this.setError('文件上传失败');
            return false;
        }catch(error) {
            this.setError(error.message);
            return false;
        }
    }
}