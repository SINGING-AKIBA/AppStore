import { PickDto } from "@midwayjs/validation";
import { Oauth } from "@/app/common/validate/Oauth";

const filelds: (keyof Oauth)[] = ["user_id", "oauth_type", "openid", "unionid"];

export class OauthUpdate extends PickDto(Oauth, filelds) {}
export class OauthSave extends PickDto(Oauth, filelds) {}
export class OauthDelete extends PickDto(Oauth, ["id", "ids"]) {}
export class OauthDetail extends PickDto(Oauth, ["id"]) {}
export class OauthIndex extends PickDto(Oauth, ["page", "pageSize"]) {}
