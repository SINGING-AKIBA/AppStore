import request from "@/smile/service/request";

export const api = {
    login: '/oauth/login',
    logout: '/oauth/logout',
    captcha: '/oauth/captcha',
    agreement: '/oauth/agreement',
}
export function login(param:any){
    return request.post(api.login, param)
}

export function logout(param:any){
    return request.get(api.logout, param)
}

export function captcha(param:any){
    return request.post(api.captcha, param)
}

export function agreement(param:any){
    return request.get(api.agreement, param)
}