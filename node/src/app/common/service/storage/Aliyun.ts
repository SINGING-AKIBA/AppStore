import { AliyunOss } from '@/app/common/enum/AliyunOss';
import OSS = require('ali-oss');
import { Base } from './Base';
import path from 'path';
import _ from 'lodash';

export class Aliyun extends Base {
    private ossClient: any;

    constructor() {
        super();
    }

    public async upload() {
        try {
            const {savePath} = await this.getSavePath();
            // 上传文件到OSS
            const client = await this.getClient();
            const result = await client.put(savePath, this.file.data);
            this.savePath = savePath;
            if (result && result.name) {
                return true;
            }
            return false;
        } catch (error) {
            this.setError(error.message);
            return false;
        }
    }

    public async saveFileInfo() {
        return {
            name: this.file.filename,
            size: this.file.size,
            ext: path.extname(this.file.filename),
            md5: '',
            sha1: '',
            savename: this.savePath.replace(/\\/g, '/'),
            storage: 'aliyun',
            domain: this.config.domain,
        };
    }

    public async delete(filePath: string) {
        try {
            const client = await this.getClient();
            await client.delete(filePath);
            return true;
        } catch (error) {
            this.setError(error.message);
            return false;
        }
    }

    public async token(params: any) {
        try {

            const {savePath} = await this.getSavePath();
            const client = await this.getClient();
            const headers = {
                "Content-Type": params.contentType || "multipart/form-data"
            }
            const url = await client.signatureUrlV4('PUT', 3600, { headers }, savePath);
            return {
                url: url,
                key: savePath,
            };
        } catch (error) {
            this.setError(error.message);
            return null;
        }
    }

    protected async getClient() {
        if (!this.ossClient) {
            const key = this.config.region.toUpperCase();
            const endpoint = AliyunOss[key];
            const region = endpoint.split('.')[0];
            const options = {
                accessKeyId: this.config.key_id,
                accessKeySecret: this.config.secret,
                bucket: _.isEmpty(this.disk) ? this.config.bucket : this.disk,
                region,
                authorizationV4: true,
                endpoint: `https://${endpoint}`,
                secure: true
            };
            const Client = OSS.default || OSS;
            this.ossClient = new Client(options);
        }
        return this.ossClient;
    }
}