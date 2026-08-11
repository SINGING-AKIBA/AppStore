import axios from "axios";
import config from "@/config";
import {useUserStore} from "@/stores/user";
import {message, notification} from 'ant-design-vue';
class Request {
  instance;
  constructor() {
    this.instance = axios.create({
      baseURL: config.request.baseUrl,
      timeout: config.request.timeout,
    });
    this.interceptorsRequest();
    this.interceptorsResponse();
  }
  errorHandler(error){
    const errMsg = ((error.response || {}).data || {}).msg ||'Network request failed. Please try again later!'
    notification.error({
      message: 'Network Error',
      description: errMsg,
      duration: 3
    });
    return Promise.reject(error)
  }
  interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config) => {
        const userStore = useUserStore();
        if(userStore.token){
          config.headers['Authorization'] = 'Bearer ' + userStore.token;
        }
        return config;
      },
      this.errorHandler
    );
      
  }
  interceptorsResponse(){
    this.instance.interceptors.response.use(
      //200正常 500有错误 401未登录 403没有权限访问
      (response) => {
        if (response.config.responseType === 'blob') {
          return Promise.resolve(response);
        }
        const {data} = response;
        const code = Number(data.code);
        if(code === 200){
          return Promise.resolve(data);
        }else if(code === 401){
          message.error('Login session expired. Please log in again!');
          const hash = window.location.hash;
          if(hash.indexOf('/admin/login') !== -1){
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          }
          return Promise.reject(data.msg);
        }else if(code === 403){
          message.error('You do not have sufficient permissions. Please contact the administrator.');
          return Promise.reject(data.msg);
        }else{
          //其他错误
          message.error(data.msg||data.message||'There was a network request error!');
          return Promise.reject(data);
        }
      },
      this.errorHandler
    );
  }
  request(config){
    return this._request(config);
  }
  _request(config){
    if('get' === config.method && config.data){
      config.param = {...config.param||{},...config.data};
    }
    return this.instance(config);
  }
  get(url,params){
    let config = {
      url,
      params,
      method:'get'
    };
    return this._request(config);
  }
  delete(url,data){
    let config = {
      url,
      data,
      method:'delete'
    };
    return this._request(config);
  }
  head(url,data){
    let config = {
      url,
      data,
      method:'head'
    };
    return this._request(config);
  }
  options(url,data){
    let config = {
      url,
      data,
      method:'options'
    };
    return this._request(config);
  }
  post(url, data){
    let config = {
      url,
      data,
      method:'post'
    };
    return this._request(config);
  }
  put(url,data){
    let config = {
      url,
      data,
      method:'put'
    };
    return this._request(config);
  }
  patch(url,data){
    let config = {
      url,
      data,
      method:'patch'
    };
    return this._request(config);
  }
}
export default new Request;