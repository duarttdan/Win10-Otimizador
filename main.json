const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Isso carrega o resultado do seu build do Vite
  win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);