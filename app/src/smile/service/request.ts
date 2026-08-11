import { useStore } from "@/smile/store/index"
import conifg from "@/config"
import { navigateTo, reLaunch } from "@/utils/nav"
class Request {
  private baseURL: string
  private timeout: number
  private showErrorToast: boolean
  private showLogin: boolean
  private interceptors: {
    request: Array<(config: Req.RequestConfig) => Req.RequestConfig>
    response: Array<(response: any) => any>
  }

  constructor(options?: { baseURL?: string; timeout?: number }) {
    this.baseURL = options?.baseURL || conifg.baseUrl
    this.timeout = options?.timeout || 60000
    this.showErrorToast = false;
    this.showLogin = false;
    this.interceptors = {
      request: [this.tokenInterceptor],
      response: []
    }
  }

  // 添加请求拦截器
  useRequestInterceptor(interceptor: (config: Req.RequestConfig) => Req.RequestConfig) {
    this.interceptors.request.push(interceptor)
  }
  tokenInterceptor(options: Req.RequestConfig): Req.RequestConfig {
    const { user } = useStore()
    const token = user.token
    if (token) {
      options.header = options.header || {}
      options.header.Authorization = `Bearer ${token}`
    }
    options['header'] = {...conifg.Headers, ...options.header};
    //console.log('tokenInterceptor', config)
    return options
  }

  // 添加响应拦截器
  useResponseInterceptor(interceptor: (response: any) => any) {
    this.interceptors.response.push(interceptor)
  }

  // 执行请求
  async request<T = any>(config: Req.RequestConfig): Promise<Req.ResponseData<T>> {
    try {
      // 处理请求拦截器
      let requestConfig = { ...config }
      this.interceptors.request.forEach(interceptor => {
        requestConfig = interceptor(requestConfig)
      })
      // 构建完整URL
      const fullURL = this.buildFullURL(requestConfig)

      // 发起请求
      const response: Req.ResponseData<T> = await this.uniRequest(requestConfig, fullURL)

      // 处理响应拦截器
      let processedResponse = response
      this.interceptors.response.forEach(interceptor => {
        processedResponse = interceptor(processedResponse)
      })

      return processedResponse
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 构建完整URL
  private buildFullURL(config: Req.RequestConfig): string {
    let url = config.baseURL || this.baseURL + config.url
    if (config.params && Object.keys(config.params).length > 0) {
      const flatParams = this.flattenParams(config.params)
      if (typeof URLSearchParams == 'function') {
        let params = new URLSearchParams(flatParams).toString()
        url += (url.includes('?') ? '&' : '?') + params
      } else {
        let params = Object.keys(flatParams)
          .map(key => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(flatParams[key])}`;
          })
          .join('&');
        if (params) {
          url += (url.includes('?') ? '&' : '?') + params;
        }
      }
    }
    return url
  }

  private flattenParams(params: Record<string, any>, prefix?: string): Record<string, string> {
    const result: Record<string, string> = {}
    for (const key in params) {
      const value = params[key]
      const newKey = prefix ? `${prefix}.${key}` : key
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(result, this.flattenParams(value, newKey))
        } else {
          result[newKey] = String(value)
        }
      }
    }
    return result
  }

  private uniRequest(config: Req.RequestConfig, fullURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.request({
        ...config,
        url: fullURL,
        method: config.method || 'GET',
        timeout: config.timeout || this.timeout,
        success: (res: any) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            if (500 == res.data.code) {
              this.handleError(res.data)
              reject(res.data)
            } else {
              resolve(res.data)
            }
          } else {
            if(401 == res.statusCode){
              if (!this.showLogin) {
                this.showLogin = true
                const { user } = useStore()
                uni.showModal({
                  title: '提示',
                  content: '登录信息过期，请重新登录！',
                  showCancel: false,
                  confirmText: '确认',
                  success: () => {
                    user.logout()
                    user.token = undefined
                    reLaunch('/pages/login/index/index')
                  },
                  complete: () => {
                    this.showLogin = false
                  }
                })
              }
              reject({
                code: 401,
                message: '登录过期',
                data: res.data
              })
            }else{
              reject({
                code: res.statusCode,
                message: (res?.data?.msg || res?.data?.message) || `HTTP Error: ${res.statusCode}`,
                data: res.data
              })
            }
            
          }
        },
        fail: (error: any) => {
          reject({
            code: -1,
            message: 'Network Error',
            data: error
          })
        }
      })
    })
  }

  // 文件上传功能
  upload<T = any>(config: Req.UploadConfig): Promise<Req.ResponseData<T>> {
    return new Promise((resolve, reject) => {
      // 处理请求拦截器（注入 token）
      let uploadConfig = { ...config }
      this.interceptors.request.forEach(interceptor => {
        uploadConfig = interceptor(uploadConfig as any) as any
      })

      // 构建完整URL
      const fullURL = config.url.startsWith('http') ? config.url : this.baseURL + config.url

      uni.uploadFile({
        url: fullURL,
        filePath: config.filePath,
        name: config.name,
        header: uploadConfig.header,
        formData: config.formData,
        timeout: config.timeout || this.timeout,
        success: (res: any) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // uni.uploadFile 返回的 data 可能是 JSON 字符串，需解析
            let data = res.data
            if (typeof data === 'string') {
              try { data = JSON.parse(data) } catch (e) {}
            }
            if (500 == data?.code) {
              this.handleError(data)
              resolve(data)
            } else {
              resolve(data)
            }
          } else {
            reject({
              code: res.statusCode,
              message: `HTTP Error: ${res.statusCode}`,
              data: res.data
            })
          }
        },
        fail: (error: any) => {
          reject({
            code: -1,
            message: 'Upload Error',
            data: error
          })
        }
      })
    })
  }

  // 文件下载功能
  download(config: Req.DownloadConfig): Promise<{ tempFilePath: string }> {
    return new Promise((resolve, reject) => {
      // 处理请求拦截器（注入 token）
      let downloadConfig = { ...config }
      this.interceptors.request.forEach(interceptor => {
        downloadConfig = interceptor(downloadConfig as any) as any
      })

      // 构建完整URL
      const fullURL = config.url.startsWith('http') ? config.url : this.baseURL + config.url

      uni.downloadFile({
        url: fullURL,
        header: downloadConfig.header,
        timeout: config.timeout || this.timeout,
        success: (res: any) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              tempFilePath: res.tempFilePath
            })
          } else {
            reject({
              code: res.statusCode,
              message: `Download Error: ${res.statusCode}`
            })
          }
        },
        fail: (error: any) => {
          reject({
            code: -1,
            message: 'Download Error',
            data: error
          })
        }
      })
    })
  }

  // 错误处理
  private handleError(error: any): Req.ResponseData {
    // 这里可以根据业务需求自定义错误处理逻辑
    if (this.showErrorToast) {
      return error
    }
    if (error.code === -1) {
      // 网络错误
      uni.showToast({
        title: error.message || '网络连接失败，请检查网络',
        icon: 'none'
      })
    } else if (error.code >= 500) {
      // 服务器错误
      uni.showToast({
        title: (error.message || error.msg) || '服务器开小差了，请稍后重试',
        icon: 'none'
      })
    }
    return error
  }

  // 快捷方法
  get<T = any>(url: string, params?: Record<string, any>, config?: Omit<Req.RequestConfig, 'url' | 'method' | 'params'>): Promise<Req.ResponseData<T>> {
    return this.request({
      url,
      method: 'GET',
      params,
      ...config
    })
  }

  post<T = any>(url: string, data?: any, config?: Omit<Req.RequestConfig, 'url' | 'method' | 'data'>): Promise<Req.ResponseData<T>> {
    return this.request({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  put<T = any>(url: string, data?: any, config?: Omit<Req.RequestConfig, 'url' | 'method' | 'data'>): Promise<Req.ResponseData<T>> {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  delete<T = any>(url: string, config?: Omit<Req.RequestConfig, 'url' | 'method'>): Promise<Req.ResponseData<T>> {
    return this.request({
      url,
      method: 'DELETE',
      ...config
    })
  }

  stream(config: Req.StreamConfig): () => void {
    const { user } = useStore()
    const token = user.token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const fullURL = config.baseURL ? config.url : this.baseURL + config.url

    // 跨分片行缓冲区（解决分片边界截断问题）
    let lineBuffer = ''
    const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8') : null
    const contentQueue: string[] = []
    let processing = false
    let doneReceived = false
    let requestCompleted = false
    let doneCalled = false
    let cancelled = false

    const DRAIN_INTERVAL = 30

    // SSE 行解析（操作闭包变量）
    const parseChunk = (text: string) => {
      lineBuffer += text
      const lines = lineBuffer.split('\n')
      lineBuffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine === '') continue
        if (trimmedLine.startsWith('data:')) {
          const data = trimmedLine.slice(5).trim()
          if (data === '[DONE]') {
            doneReceived = true
          } else if (data) {
            contentQueue.push(data)
          }
        } else {
          try {
            const json = JSON.parse(trimmedLine)
            if (json.code == 500) {
              config.onError?.(json.message || '服务繁忙，请稍后重试!')
            }
          } catch (e) {
            config.onError?.(e)
          }
        }
      }
    }

    const tryComplete = () => {
      if (doneCalled) return
      if (contentQueue.length === 0 && (doneReceived || requestCompleted)) {
        doneCalled = true
        if (processorTimer !== null) {
          clearInterval(processorTimer)
          processorTimer = null
        }
        processing = false
        config.onDone?.()
      }
    }

    const processItem = () => {
      if (cancelled) return
      if (contentQueue.length === 0) {
        tryComplete()
        return
      }
      const item = contentQueue.shift()!
      config.onChunk(item)
      tryComplete()
    }

    const startProcessor = () => {
      if (processing) return
      processing = true
      processorTimer = setInterval(processItem, DRAIN_INTERVAL)
    }

    let processorTimer: number | null = null

    // 检测 App 原生平台（Android / iOS）
    // uni.request + enableChunked 在 Android 原生层桥接存在分片回调不触发的问题
    const isAppPlus = typeof plus !== 'undefined' && plus.net && typeof plus.net.XMLHttpRequest === 'function'

    if (isAppPlus) {
      // App 原生平台：plus.net.XMLHttpRequest + readyState 3 监听增量数据
      let lastPos = 0
      const xhr = new plus.net.XMLHttpRequest()
      xhr.open('POST', fullURL)
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value)
      }

      xhr.onreadystatechange = () => {
        if (cancelled) return
        if (xhr.readyState === 3 || xhr.readyState === 4) {
          const allText = xhr.responseText || ''
          const newText = allText.substring(lastPos)
          lastPos = allText.length

          if (xhr.readyState === 4) {
            requestCompleted = true
          }

          if (newText) {
            parseChunk(newText)
            if (!processing) {
              startProcessor()
            }
          }
        }
      }

      xhr.onerror = (err: any) => {
        if (!cancelled) {
          config.onError?.(err)
        }
        cancelled = true
        if (processorTimer !== null) {
          clearInterval(processorTimer)
          processorTimer = null
          processing = false
        }
      }

      xhr.send(config.data ? JSON.stringify(config.data) : null)

      return () => {
        cancelled = true
        if (processorTimer !== null) {
          clearInterval(processorTimer)
          processorTimer = null
          processing = false
        }
        xhr.abort()
        config.onCancel?.()
      }
    }

    // H5 / 微信小程序：uni.request + onChunkReceived
    const requestTask = uni.request({
      url: fullURL,
      method: 'POST',
      data: config.data,
      header: headers,
      timeout: config.timeout || this.timeout,
      enableChunked: true,
      responseType: 'arraybuffer',
      success: () => {
        requestCompleted = true
        tryComplete()
      },
      fail: (error: any) => {
        if (!cancelled) {
          config.onError?.(error)
        }
        cancelled = true
        if (processorTimer !== null) {
          clearInterval(processorTimer)
          processorTimer = null
          processing = false
        }
      }
    }) as any

    if (requestTask.onChunkReceived) {
      requestTask.onChunkReceived((res: { data: ArrayBuffer }) => {
        if (cancelled) return

        let text: string
        if (decoder) {
          text = decoder.decode(res.data, { stream: true })
        } else {
          const uint8Array = new Uint8Array(res.data)
          text = decodeURIComponent(escape(String.fromCharCode(...uint8Array)))
        }

        parseChunk(text)

        if (!processing) {
          startProcessor()
        }
      })
    } else {
      console.warn('当前平台不支持 stream 请求')
    }

    return () => {
      cancelled = true
      if (processorTimer !== null) {
        clearInterval(processorTimer)
        processorTimer = null
        processing = false
      }
      requestTask.abort?.()
      config.onCancel?.()
    }
  }
}

export default new Request()