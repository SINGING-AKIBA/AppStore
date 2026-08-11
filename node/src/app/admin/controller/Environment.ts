import { Post, Controller } from '@midwayjs/core';
import { SmileController } from '@/decorator/controller';
import { Base } from '@/app/common/controller/Base';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@SmileController("/admin/environment", { tagName: "admin/环境检测" })
export class Environment extends Base {

    @Post('/index')
    async index() {
        this.success([
            this.server(),
            this.nodeExtensions(),
            this.writeable()
        ]);
    }

    protected server() {
        const nodeVersion = process.version;
        return {
            key: 'server',
            title: '服务器信息',
            value: [
                {
                    name: '服务器操作系统',
                    key: 'system',
                    value: os.platform() + ' ' + os.release(),
                    status: os.platform() === 'win32' ? 'warning' : 'normal',
                    remark: '建议使用 Linux 操作系统'
                },
                {
                    name: 'Web服务器环境',
                    value: process.env.SERVER_SOFTWARE || 'Node.js',
                    status: 'normal',
                    remark: '建议使用 Nginx'
                },
                {
                    name: 'Node版本',
                    value: nodeVersion,
                    status: this.compareVersion(nodeVersion, '20.0.0') === -1 ? 'danger' : 'normal',
                    remark: 'Node版本必须为 20.0.0 以上'
                },
                {
                    name: '程序运行目录',
                    value: process.cwd(),
                    status: 'normal',
                    remark: ''
                },
                {
                    name: 'CPU核心数',
                    value: os.cpus().length,
                    status: 'normal',
                    remark: ''
                },
                {
                    name: '内存总量',
                    value: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                    status: 'normal',
                    remark: ''
                }
            ]
        };
    }

    private nodeExtensions() {
        return {
            key: 'nodeExtensions',
            title: 'Node.js扩展',
            value: [
                {
                    name: 'Node版本',
                    value: '20.0.0及以上',
                    status: this.compareVersion(process.version, '20.0.0') === -1 ? 'danger' : 'normal',
                    remark: 'Node版本必须为 20.0.0及以上'
                },
                {
                    name: 'mysql2',
                    value: '支持',
                    status: 'normal',
                    remark: 'MySQL数据库驱动'
                },
                {
                    name: 'redis',
                    value: '支持',
                    status: 'normal',
                    remark: 'Redis客户端'
                },
                {
                    name: 'bcrypt',
                    value: '支持',
                    status: 'normal',
                    remark: '密码加密'
                },
                {
                    name: 'crypto',
                    value: '支持',
                    status: 'normal',
                    remark: '加密模块'
                },
                {
                    name: 'stream',
                    value: '支持',
                    status: 'normal',
                    remark: '流处理模块'
                },
                {
                    name: 'zlib',
                    value: '支持',
                    status: 'normal',
                    remark: '压缩模块'
                },
                {
                    name: 'http',
                    value: '支持',
                    status: 'normal',
                    remark: 'HTTP模块'
                },
                {
                    name: 'https',
                    value: '支持',
                    status: 'normal',
                    remark: 'HTTPS模块'
                }
            ]
        };
    }

    private writeable() {
        const rootDir = process.cwd();
        const storageDir = path.join(rootDir, 'storage');
        const runtimeDir = path.join(rootDir, 'runtime');
        const publicDir = path.join(rootDir, 'public');

        return {
            key: 'path',
            title: '目录权限',
            value: [
                {
                    name: '存储目录',
                    value: storageDir,
                    status: this.checkWriteable(storageDir) ? 'normal' : 'danger',
                    remark: '目录不可写，系统将无法正常存储文件'
                },
                {
                    name: '运行时目录',
                    value: runtimeDir,
                    status: this.checkWriteable(runtimeDir) ? 'normal' : 'danger',
                    remark: '目录不可写，系统将无法正常写入文件'
                },
                {
                    name: '静态文件目录',
                    value: publicDir,
                    status: this.checkWriteable(publicDir) ? 'normal' : 'warning',
                    remark: '目录不可写，系统将无法正常访问静态文件'
                }
            ]
        };
    }

    private compareVersion(v1: string, v2: string): number {
        const v1Parts = v1.replace('v', '').split('.').map(Number);
        const v2Parts = v2.replace('v', '').split('.').map(Number);

        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            if (v1Part > v2Part) return 1;
            if (v1Part < v2Part) return -1;
        }
        return 0;
    }

    private checkWriteable(dirPath: string): boolean {
        try {
            if (!fs.existsSync(dirPath)) {
                return false;
            }
            const stats = fs.statSync(dirPath);
            if (!stats.isDirectory()) {
                return false;
            }
            const testFile = path.join(dirPath, '.write_test_' + Date.now());
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            return true;
        } catch {
            return false;
        }
    }
}
