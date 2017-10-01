const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const extDir = (process.argv[process.argv.length - 1] === 'plain') ? 'client' : 'client_built';
const Settings = require('./settings.js');
let mainWindow;

// console.log(process.argv);
// console.log('process.env.VSCODE_PID: ' + process.env.VSCODE_PID);

// Print some debugging information if running from within Visual Studio Code
// if (process.env.VSCODE_PID) {
//     console.log('extDir: ' + extDir);
// }

const settings = new Settings({
    // The name of the data file
    configName: 'user-preferences',
    defaults: {
        windowBounds: { width: 1280, height: 720 }
    }
});

// Define global constants which will be copied into the mcat.cfg.Global singleton
global.Constants = {
    musicDir: settings.get('lastDir') || app.getPath('music'),
    pathSep: path.sep
};

// Set up the fake web server
const server = require('./server/server')();

function createWindow () {
    let { width, height } = settings.get('windowBounds');
    mainWindow = new BrowserWindow({ width, height });
    mainWindow.loadURL(`file://${__dirname}/${extDir}/index.html`);
    
    if (process.env.VSCODE_PID) {
        mainWindow.webContents.openDevTools();
    }
    
    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        settings.set('windowBounds', { width, height });
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed, except for Mac users
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
});

// Handle plain IPC call from the browser window
// ipcMain.on('asdf', (event, data) => {
//     console.log('data: ' + data);
// });

exports.Settings = settings;

exports.selectDirectory = function (callback) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }, function(filenames) {
        if (filenames) callback(filenames[0]);
    });
}