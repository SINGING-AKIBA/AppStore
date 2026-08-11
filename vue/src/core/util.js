import dayjs from "dayjs"

export function debounce (fun, delay, ...args) {
    clearTimeout(fun.id)
    fun.id = setTimeout(() => {
        fun(...args)
    }, delay)
}

export function timeFormat (time,format='YYYY-MM-DD HH:mm:ss') {
    return dayjs(time).format(format)
}


// 获取视频时长的工具函数
export const getVideoDuration = (url) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url
    video.muted = true // 防止某些浏览器阻止自动加载
    
    // 监听元数据加载完成
    video.onloadedmetadata = () => {
      const duration = video.duration
      video.remove() // 销毁元素释放内存
      resolve(Math.floor(duration)) // 返回整数秒数
    }
    
    // 监听加载错误
    video.onerror = () => {
      video.remove()
      reject(new Error('视频加载失败'))
    }

    // 兼容移动端：强制触发加载
    const triggerLoad = () => {
      video.play().then(() => video.pause()).catch(() => {})
    }
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.invoke('getNetworkType', {}, triggerLoad)
    } else {
      triggerLoad()
    }
  })
}
  