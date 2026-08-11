import router from '@/router'
const publicRoouter = ['/admin/login']
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user'
import { notification } from 'ant-design-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
router.beforeEach((to, from, next)=>{
    NProgress.start();
    const userStore = useUserStore();
    if(publicRoouter.includes(to.path)){
        next()  
    }else{
        const redirect = to.fullPath;
        if(userStore.token){
            if(userStore.menus.length === 0){
                userStore.getUserMenus().then((res)=>{
                    router.addRoute(res)
                    next({...to, replace: true})
                }).catch(err=>{
                    notification.error({
                        message: 'Login failed',
                        description: err?.message || err?.msg || ''
                    })
                    next({ path: '/admin/login',query: { redirect }})
                })
            }else{
                next()
            }
        }else{
            next({ path: '/admin/login',query: { redirect }})
        }
    } 
})
router.afterEach((to, from, next)=>{
    const menuStore = useMenuStore()
    if(!publicRoouter.includes(to.path)){
        menuStore.addTab(to)
    }
    NProgress.done()
})