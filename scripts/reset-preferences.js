const fs = require('fs');
const path = require('path');
const os = require('os');

function resetPreferences() {
    // Get the user's app data directory
    const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? path.join(os.homedir(), 'Library/Application Support') : path.join(os.homedir(), '.config'));
    const electronAppPath = path.join(appDataPath, 'electron-app');

    try {
        // If the directory exists, try to find and modify localStorage files
        if (fs.existsSync(electronAppPath)) {
            const files = fs.readdirSync(electronAppPath);
            
            // Look for Local Storage files
            const localStorageFiles = files.filter(file => file.includes('Local Storage'));
            
            if (localStorageFiles.length > 0) {
                localStorageFiles.forEach(dir => {
                    const leveldbPath = path.join(electronAppPath, dir, 'leveldb');
                    if (fs.existsSync(leveldbPath)) {
                        // Remove the entire leveldb directory to clear localStorage
                        fs.rmSync(leveldbPath, { recursive: true, force: true });
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error resetting preferences:', error);
        process.exit(1);
    }
}

resetPreferences(); 