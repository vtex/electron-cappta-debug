const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')

const CAPPTA_CHECKOUT_URL = 'https://instore.vtexcommercestable.com.br/checkout/instore-cappta?acquirerProtocol=cappta&action=payment&installmentType=2&installments=1&paymentType=credit&amount=100&installmentsInterestRate=0&scheme=instore&autoConfirm=true&cnpj=42724382000146&authKey=DB780A0AB89845D283FF8C779638B54D&authPassword=vtex&administrativePassword=cappta'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Cappta Testing Checkout',
    webPreferences: {
      allowRunningInsecureContent: true,
    },
  })

  mainWindow.maximize()

  // allow cappta https error
  mainWindow.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    if (url.indexOf('cappta.api.s3.amazonaws.com') !== -1) {
      // verification logic
      event.preventDefault()
      callback(true)
    } else {
      callback(false)
    }
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.webContents.session.clearCache(() => {
    console.log('Cache cleared')
    // Load cappta url with example params
    mainWindow.loadURL(CAPPTA_CHECKOUT_URL)
  })

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
