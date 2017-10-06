const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const extDir = (process.argv[process.argv.length - 1] === 'plain') ? 'client' : 'client_built';
const Settings = require('./settings.js');
let mainWindow;

// Print some debugging information if running from within Visual Studio Code
// if (process.env.VSCODE_PID) {
//     console.log('extDir: ' + extDir);
// }

const settings = new Settings({
    configName: 'user-preferences', // json filename
    defaults: {
        windowBounds: { width: 1280, height: 720 },
        musicDir: app.getPath('music'),
        treeWidth: 230,
        volumeLevel: 100,
        pathSep: path.sep
    }
});

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

// Receive a request from the browser to read the contents of a file
ipcMain.on('file:read', (event, path) => {
    var blob = fs.readFileSync(path);
    mainWindow.webContents.send('file:contents', blob);
});

exports.Settings = settings;

exports.selectDirectory = function (callback) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }, function(filenames) {
        if (filenames) callback(filenames[0]);
    });
}