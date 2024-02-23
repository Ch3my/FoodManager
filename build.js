// Hace unas vainas para poner la ENV variable dentro del eas.json para que compile
// con la variable luego la quita asi no se guarda en el repositorio

// El valor lo lee de .env que esta en el gitignore

const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

const fileStream = fs.createReadStream('.env');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

const easConfig = require('./eas.json');

rl.on('line', (line) => {
  if (line.startsWith('EXPO_PUBLIC_SUPABASE_ANONKEY')) {
    const [key, value] = line.split('=');
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    
    if (easConfig.build && easConfig.build.apk && easConfig.build.apk.android && easConfig.build.apk.android.env) {
      easConfig.build.apk.android.env.EXPO_PUBLIC_SUPABASE_ANONKEY = trimmedValue;
    }
  }
});

rl.on('close', () => {
  fs.writeFile('eas.json', JSON.stringify(easConfig, null, 2), (err) => {
    if (err) throw err;
    console.log('eas.json updated successfully.');

    // After updating eas.json, execute eas build command
    exec('eas build -p android --profile apk', (error, stdout, stderr) => {
    // exec('echo hi', (error, stdout, stderr) => {

      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);

      // Reset EXPO_PUBLIC_SUPABASE_ANONKEY property in eas.json to empty string
      if (easConfig.build && easConfig.build.apk && easConfig.build.apk.env) {
        easConfig.build.apk.env.EXPO_PUBLIC_SUPABASE_ANONKEY = '';
      }

      // Write the modified eas.json with empty string for EXPO_PUBLIC_SUPABASE_ANONKEY back to the file
      fs.writeFile('eas.json', JSON.stringify(easConfig, null, 2), (err) => {
        if (err) throw err;
        console.log('EXPO_PUBLIC_SUPABASE_ANONKEY property reset to empty string in eas.json.');
      });
    });
  });
});
