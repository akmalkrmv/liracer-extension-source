import {spawn} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

// ES module equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run all watchers concurrently
const watchers = [
  'npm run watch:background',
  'npm run watch:content',
  'npm run watch:popup',
  'npm run watch:popup:material',
];

console.log('🚀 Starting development mode...\n');

// Copy manifest on start
fs.copyFileSync(
  path.join(__dirname, '../src/manifest.json'),
  path.join(__dirname, '../build/manifest.json')
);

// Watch manifest for changes
fs.watch(path.join(__dirname, '../src/manifest.json'), () => {
  fs.copyFileSync(
    path.join(__dirname, '../src/manifest.json'),
    path.join(__dirname, '../build/manifest.json')
  );
  console.log('📋 Manifest updated');
});

watchers.forEach((cmd) => {
  const [command, ...args] = cmd.split(' ');
  spawn(command, args, {stdio: 'inherit', shell: true});
});
