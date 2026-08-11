declare namespace Api {

    interface user {
        /**
         * 获取用户列表
         */
        index(data:any): Promise<any>
        /**
         * 登录
         */
        login(data:any): Promise<any>
        /**
         * 注册
         */
        register(data:any): Promise<any>
        /**
         * 登出
         */
        logout(data:any): Promise<any>
        /**
         * 获取用户详情
         */
        detail(data:any): Promise<any>
        /**
         * 修改用户信息
         */
        update(data:any): Promise<any>
        /**
         * 选择用户
         */
        select(data:any): Promise<any>

    }
    type Service = {
        user: user
    }
}