const { contextBridge } = require('electron')

// 安全暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 添加需要暴露的 API
})