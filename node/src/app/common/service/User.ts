import { Base } from './Base';

export abstract class User extends Base {
  protected userInfo: any;
  protected error: string | null = null;
  protected token: string | null = null;

  abstract getUserId(): Promise<number>;
  
  abstract getUserInfo<T=any>():Promise<T | null>; 

  protected getError(): string | null {
    return this.error;
  }
  
  protected setError(error: string): void {
    this.error = error;
  }

  public getToken(): string | null {
    return this.token;
  }
  protected filterWhere(){
    return {}
  }
}