import { Rule } from '@midwayjs/validation';
import { ApiProperty } from '@midwayjs/swagger';
import * as Joi from 'joi';
import { Base } from "@/app/common/validate/Base";

export class AppVersion extends Base {
@Rule(Joi.number().min(0).max(4294967295).required().label("APP ID"))
@ApiProperty({ description: 'APP ID'  })
app_info_id: number;
@Rule(Joi.string().max(20).required().label("版本号"))
@ApiProperty({ description: '版本号'  })
version: string;
@Rule(Joi.number().min(0).max(4294967295).optional().allow(null,'').label("内部版本号"))
@ApiProperty({ description: '内部版本号'  })
version_code: number;
@Rule(Joi.string().max(20).optional().allow(null,'').label("安装包大小"))
@ApiProperty({ description: '安装包大小，如 "42.5 MB"'  })
size: string;
@Rule(Joi.string().max(20).optional().allow(null,'').label("iOS最低支持版本"))
@ApiProperty({ description: 'iOS最低支持版本'  })
min_os_ios: string;
@Rule(Joi.string().max(20).optional().allow(null,'').label("Android最低支持版本"))
@ApiProperty({ description: 'Android最低支持版本'  })
min_os_android: string;
@Rule(Joi.string().max(500).optional().allow(null,'').label("iOS App Store下载链接"))
@ApiProperty({ description: 'iOS App Store下载链接'  })
ios_url: string;
@Rule(Joi.string().max(50).optional().allow(null,'').label("iOS App Store ID"))
@ApiProperty({ description: 'iOS App Store ID'  })
ios_appstore: string;
@Rule(Joi.string().max(500).optional().allow(null,'').label("Android APK下载链接"))
@ApiProperty({ description: 'Android APK下载链接'  })
android_url: string;
@Rule(Joi.string().optional().allow(null,'').label("更新日志/新特性说明"))
@ApiProperty({ description: '更新日志/新特性说明'  })
changelog: string;
@Rule(Joi.number().min(0).max(255).valid(0, 1).required().label("强制更新开关"))
@ApiProperty({ description: '强制更新开关:0=非强制,1=强制'  })
force_update_switch: number;
@Rule(Joi.number().min(0).max(255).valid(10, 20, 30).required().label("状态"))
@ApiProperty({ description: '状态:10=草稿,20=已发布,30=已回滚'  })
status: number;
@Rule(Joi.date().optional().allow(null,'').label("发布时间"))
@ApiProperty({ description: '发布时间'  })
publish_time: Date;
}