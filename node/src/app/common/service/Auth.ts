import { Inject, Provide } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
@Provide()
export abstract class Auth {
    @Inject()
    protected jwtService: JwtService;
    abstract getConfig(): any;
    abstract login(params): Promise<any>;

    getUserToken(info: any): { token: string, expiresIn: number } {
        const conifg = this.getConfig();
        const token = this.jwtService.signSync(info, conifg.secret, { expiresIn: conifg.expiresIn })
        return { token, expiresIn: conifg.expiresIn };
    }
    verifySync(token: string): any {
        const config = this.getConfig()
        try {
            return this.jwtService.verifySync(token, config.secret)
        } catch (error) {
            return false;
        }
    }
    protected filterWhere() {

    }
}