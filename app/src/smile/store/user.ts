import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { login as LoginApi } from '@/api/Login'
const localUserInfo = storage.get('userInfo')
const useUserStore = defineStore('user', () => {
  const userInfo = ref<any | undefined>(localUserInfo || undefined)
  const token = ref<string | undefined>(localUserInfo?.token || undefined)
  // 计算属性：判断用户是否已登录
  const isLoggedIn = computed(() => {
    return !!userInfo.value && Object.keys(userInfo.value).length > 0
  })
  // 设置用户信息
  function setUserInfo(info: any) {
    userInfo.value = info
    if (info && Object.keys(info).length > 0) {
      storage.set('userInfo', info)
    } else {
      storage.remove('userInfo')
    }
  }
  
  // 用户登录
  async function login(userInfoData: any) {
    return new Promise((resolve, reject) => { 
      LoginApi(userInfoData).then( res => { 
        setUserInfo(res.data);
        token.value = res.data.token;
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
    
    
  }
  
  // 用户登出
  function logout() {
    setUserInfo(undefined)
    storage.remove('userInfo')
  }
  
  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = undefined
    storage.remove('userInfo')
  }

  return {
    token,
    userInfo, 
    isLoggedIn,
    setUserInfo, 
    login,
    logout,
    clearUserInfo
  }
})
export { useUserStore }