import _ from 'lodash';
import { Base } from './Base';
import path from 'path';
import fs from 'fs';

export class Local extends Base {
    constructor() {
        super();
    }
    /**
     * 文件上传 file模式
     * @returns 
     */
    public async upload() {
        const file = this.file;
        if (_.isEmpty(file)) {
            this.setError('上传文件不存在');
            return false;
        }
        if (!this.validate()) {
            return false;
        }

        const { savePath } = await this.getSavePath();
        const saveFile = path.posix.join(this.disk, savePath);

        const dirPath = path.dirname(saveFile);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        try {
            fs.renameSync(file.data, saveFile);
        } catch (err) {
            if (err.code === 'EXDEV') {
                try {
                    fs.copyFileSync(file.data, saveFile);
                    fs.unlinkSync(file.data); // 清理临时文件
                } catch (copyErr) {
                    this.setError(copyErr.message);
                    return false;
                }
            } else {
                this.setError(err.message);
                return false;
            }
        }

        this.savePath = savePath;
        return true;
    }

    public async saveFileInfo() {
        return {
            name: this.file.filename,
            size: this.file.size,
            ext: path.extname(this.file.filename),
            md5: '',
            sha1: '',
            savename: this.savePath.replace(/\\/g, '/'),
            storage: 'local',
            domain: '', 
        };
    }

    public async delete(filePath: string) {
        const realPath = path.join(this.disk, filePath);
        if(fs.existsSync(realPath)){
            fs.unlinkSync(realPath);
            return true;
        }
        return false;
    }

    public async token(params:any) {
        return null;
    }
}