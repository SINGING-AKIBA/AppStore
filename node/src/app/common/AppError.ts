export class AppError extends Error {
    public status: number;
    public message: string;
    public code: number;
    public data: any;
    /**
     * 抛出异常
     * @param message 错误信息
     * @param status http状态码
     * @param code 错误代码
     */
    public constructor(message: string, code = 200,status: number = 200) {
        super(message);
        this.status = status;
        this.message = message;
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}