import { Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import * as path from 'path';
import * as fs from 'fs';

export interface Location {
    path: string;
    line: number;
    column: number;
    source: string;
}

@Provide()
@Scope(ScopeEnum.Singleton)
export class LocationUtil {
    private locationCache = new Map<string, Location>();
    distPath: string;

    @Init()
    async init() {
        this.distPath = this.getRunPath();
    }

    getDistPath(): string {
        return this.distPath;
    }

    scriptPath(target: any): Location | null {

        const targetName = target.name;
        /*
        if (this.locationCache.has(targetName)) {
            return this.locationCache.get(targetName)!;
        }*/

        const originalPrepareStackTrace = Error.prepareStackTrace;
        let targetFile: Location | null = null;

        try {
            Error.prepareStackTrace = (error, stack) => stack;
            const stack = new Error().stack as any;
            for (const site of stack) {
                const fileName = site.getFileName();
                if (!fileName || !fs.existsSync(fileName)) continue;
                if (!/[/\\]controller[/\\]/.test(fileName)) continue;
                if (fileName.includes(targetName)) {
                    targetFile = {
                        path: fileName,
                        line: site.getLineNumber() ?? 0,
                        column: site.getColumnNumber() ?? 0,
                        source: `file://${fileName}`,
                    };
                    this.locationCache.set(fileName, targetFile);
                    break;
                };
            }
        } finally {
            Error.prepareStackTrace = originalPrepareStackTrace;
        }
        return targetFile;
    }

    getRunPath(): string {
        return path.join(__dirname,'../../');
    }
}

export default new LocationUtil();