const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  if (app.isPackaged) {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load packaged index.html:', err);
    });
  } else {
    win.loadURL('http://localhost:5173').catch(err => {
      console.error('Failed to load dev server at http://localhost:5173:', err);
    });
  }
}

ipcMain.handle('run-powershell', async (event, command) => {
  return new Promise((resolve, reject) => {
    exec(`powershell.exe -Command "${command}"`, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
});

app.whenReady().then(createWindow);