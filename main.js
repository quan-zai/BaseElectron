const electron  = require('electron')
const { globalShortcut, app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { appUpdater } = require('./autoupdater')
const path = require('path')
const url = require('url')

if (require('electron-squirrel-startup')) {
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
    console.log('process.platform =====', process.platform)
    return process.platform === 'darwin' || process.platform === 'win32';
}

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600 })
    mainWindow.setMenuBarVisibility(true)
    // and load the index.html of the app.
    //   mainWindow.loadURL("https://electron.org.cn/")
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // add accelerator
    // globalShortcut.register('Cmd+Y', () => {
    //     let child = new BrowserWindow({ parent: mainWindow, modal: true, show: true })
    //     child.loadURL("https://baidu.com")
    //     child.setFullScreen(true)
    //     child.once('ready-to-show', () => {
    //         child.show()
    //     })
    // })

    // if(!isDev) {
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    // }

    const page = mainWindow.webContents;

    page.once('did-frame-finish-load', () => {
        const checkOS = isWindowsOrmacOS();
        console.log('1111111111')

        if (checkOS && !isDev) {
            // Initate auto-updates on macOs and windows
            console.log('app_updater')
            appUpdater();
        }});

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('console', (event, arg) => {
    console.log('arg ==== ', arg)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
