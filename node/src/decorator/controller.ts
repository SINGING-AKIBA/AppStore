import { CONTROLLER_KEY, DecoratorManager, Provide, Scope, ScopeEnum, MiddlewareParamArray, MetadataManager, } from '@midwayjs/core';
import type { ControllerOption } from "@midwayjs/core";

import  admin from '@/app/admin/config'
import  api from '@/app/api/config'


export function SmileController(
    prefix?: string,
    routerOptions: {
        sensitive?: boolean;
        middleware?: MiddlewareParamArray;
        description?: string;
        tagName?: string;
        ignoreGlobalPrefix?: boolean;
        version?: string | string[];
        versionType?: 'URI' | 'HEADER' | 'MEDIA_TYPE' | 'CUSTOM';
        versionPrefix?: string;
    } = { middleware: [], sensitive: true }
): ClassDecorator {
    return (target: any) => {
        DecoratorManager.saveModule(CONTROLLER_KEY, target);
        // fallback 默认值
        if (!prefix) {
            prefix = '/';
        }
        
        // 确保prefix格式正确
        prefix = prefix.toLowerCase();
        if (prefix !== '/' && prefix.endsWith('/')) {
            prefix = prefix.slice(0, -1);
        }
        if(!prefix.startsWith('/')){
            prefix = '/' + prefix;
        }
        
        if(prefix.startsWith('/admin')){
            routerOptions.middleware = [...admin?.middleware,...(routerOptions.middleware || []) ];
        }else if(prefix.startsWith('/api')){
            routerOptions.middleware = [...api?.middleware,...(routerOptions.middleware || []) ];
        }

        MetadataManager.defineMetadata(
            CONTROLLER_KEY,
            {
                prefix,
                routerOptions,
            } as ControllerOption,
            target
        );
        Scope(ScopeEnum.Request)(target);
        Provide()(target);
    };
}