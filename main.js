const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Isso carrega o resultado do seu build do Vite
  win.loadFile(path.join(__dirname, 'dist/index.html'));
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