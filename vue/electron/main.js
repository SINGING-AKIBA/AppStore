const { app, BrowserWindow,Menu  } = require('electron')
const path = require('path')

let mainWindow
Menu.setApplicationMenu(null)
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  
  // 开发模式加载 Vite 服务
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // 生产模式加载构建后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  mainWindow.on('closed', () => (mainWindow = null))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})