import { defineStore } from 'pinia'
import * as loginApi from '@/api/Login'
import { list as menuList } from '@/api/Menu'
import storage from 'store'
import config from '@/config'
import { rootRouter,notFoundRouter } from '@/router'
import error from '@/views/error/404.vue'
const list  = import.meta.glob('/src/views/**/*.vue')
const generator = (routerMap, parent) => {
    return routerMap.map(item => {
      const currentRouter = {
        path: item.path,
        name: item.name,
        meta: item.meta || {},
      } 
      if (!currentRouter.path.startsWith('http')) {
        currentRouter.path = currentRouter.path.replace('//', '/')
      }
      if(Number(item.type) !== 10){// 类型不是菜单加载文件
        let componentPath = '/src/views'+item.path+'.vue';
        currentRouter['component'] = list[componentPath] || error;
      }
      // 重定向
      if(item.redirect){
        currentRouter['redirect'] = item.redirect
      }
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        currentRouter['children'] = generator(item.children, currentRouter)
      }
      return currentRouter
    })
}
const permissions = (menus)=>{
    const result = new Set();
    const traverse = (items) => {
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                traverse(item.children)
            }
            result.add(item.name.toLowerCase());
        });
    };
    traverse(menus);
    return Array.from(result);
}

const defaultUserInfo ={
    id: '',
    name: '',
    email: '',
    avatar: '',
}
export const useUserStore = defineStore('user',{
    state: () => {
        return {
            userInfo: defaultUserInfo,
            token: '',
            menus:[],//菜单
            permissions: []//权限
        }
    },
    getters: {
        getUserInfo: (state) => {
            return state.userInfo
        },
        getToken: (state) => {
            return state.token
        },
        getPermissions: (state) => {
            return state.permissions
        },
    },
    actions: {
        syncStorage() {
            let time = Date.now();
            let token = storage.get(config.login.tokenStorageKey);
            if(token && time < token.outTime){
                this.token = token.token;
                this.userInfo = storage.get(config.login.userStorageKey);
            }
        },
        login(values){
            return new Promise((resolve,reject)=>{
                loginApi.login(values).then(res=>{
                    this.token = res.data.token
                    this.userInfo = res.data.userInfo
                    if(values.remember === true){
                        let data ={
                            token:res.data.token,
                            outTime:config.login.tokenOutTime + Date.now()
                        }
                        storage.set(config.login.tokenStorageKey,data)
                        storage.set(config.login.userStorageKey,this.userInfo)
                    }
                    resolve(res)
                })
                .catch(err=>{
                    reject(err)
                })
            })
        },
        logout(){
            return new Promise((resolve,reject)=>{
                loginApi.logout().then(res=>{
                    this.userInfo = defaultUserInfo;
                    this.token = '';
                    this.menus = [];
                    this.permissions = [];
                    storage.remove(config.login.tokenStorageKey);
                    storage.remove(config.login.userStorageKey);
                    resolve(res);
                })
                .catch(err=>{
                    reject(err)
                })
            })
        },
        getUserMenus(){
            return new Promise((resolve,reject)=>{
                menuList().then(res=>{
                    this.menus = res.data;
                    this.permissions = permissions(res.data);
                    rootRouter.redirect = res.data[0].redirect || res.data[0].path;
                    rootRouter.children = generator(res.data);
                    rootRouter.children.push(notFoundRouter);
                    resolve(rootRouter)
                })
                .catch(err=>{
                    reject(err)
                })
            })
        }
    }
})