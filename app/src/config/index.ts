// #ifdef H5 
const platform = 'h5'
// #endif 

// #ifdef MP-WEIXIN
const platform = 'MP-WEIXIN'
// #endif 

// #ifdef APP 
const platform = 'APP'
// #endif

export default {
  name: 'App',
  // #ifdef H5
  baseUrl: import.meta.env.MODE === 'development' ? 'http://127.0.0.1:7010/api' : '/api',
  // #endif
  // #ifndef H5
  baseUrl: 'https://cyxy.kidhub.cn/api',
  // #endif
  Headers: {'platform': platform || 'MP-WEIXIN'}
}