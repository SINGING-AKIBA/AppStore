import { Base } from './Base';
import * as Kodo from 'qiniu';
import path from 'path';

export class Qiniu extends Base {
    private client: any;
    constructor() {
        super();
    }
    public async delete(filePath: string) {
        const client = await this.getClient();
        client.delete(this.config.bucket, filePath,(err, ret)=>{
            if(err){
                this.setError(err.message|| '删除失败');
                return false;
            }
            return true;
        });

    }
    protected async getClient() {
        if (!this.client) {
            this.client = Kodo;
            this.client.conf.ACCESS_KEY = this.config.ak;
            this.client.conf.SECRET_KEY = this.config.sk;
        }
        return this.client;
    }
    public async saveFileInfo() {
        return {
            name: this.file.filename,
            size: this.file.size,
            ext: path.extname(this.file.filename),
            md5: '',
            sha1: '',
            savename: this.savePath.replace(/\\/g, '/'),
            storage: 'qiniu',
            domain: this.config.domain,
        };
    }
    public async token(params: any) {
        const {savePath} = await this.getSavePath();
        const client = await this.getClient();
        const putPolicy = new client.rs.PutPolicy(this.config.bucket + ':' + savePath);
        const token = putPolicy.token();
        return {
            token,
            key: savePath,
        };

    }
    public async upload() {
        if(!this.file){
            this.setError('请选择文件');
            return false;
        }
        const client = await this.getClient();
        const { token, key } = await this.token({});
        const extra = new client.io.PutExtra();
        client.io.putFile(token, key, this.file.data, extra,(err, ret)=>{
            if(err){
                this.setError(err.message|| '上传失败');
                return false;
            }
            this.savePath = key;
            return true;
        });
    }
}