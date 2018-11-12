const { BrowserWindow } = require('electron')

const window = module.exports = new BrowserWindow({
  width: 640,
  height: 480,
  useContentSize: true,
  resizable: false,
  minimizable: false,
  maximizable: false
})

window.setMenu(null)
window.loadFile('index.html')
window.webContents.openDevTools({ mode: 'detach' })
