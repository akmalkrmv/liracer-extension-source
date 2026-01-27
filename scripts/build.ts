import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

// ES module equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building Chrome Extension...\n');

// Path to the manifest file
const manifestPath = path.join(__dirname, '../src/manifest.json');

// Read the manifest file with the original formatting
const manifestContent = fs.readFileSync(manifestPath, 'utf8');

// Parse the content as JSON
const manifest = JSON.parse(manifestContent);

// Extract the current version and increment the patch version
let version = manifest.version.split('.').map(Number);
version[2] += 1; // Increment the patch version
const newVersion = version.join('.');

// Update only the version line in the original content using regex
// This preserves all original formatting
const updatedManifestContent = manifestContent.replace(
  /"version"\s*:\s*"[^"]+"/,
  `"version": "${newVersion}"`
);

// Write the updated content back to the manifest.json file
fs.writeFileSync(manifestPath, updatedManifestContent, 'utf8');

console.log(`📝 Version updated: ${manifest.version} → ${newVersion}`);

// Clean dist directory, but avoid touching .git folder
const distPath = path.join(__dirname, '../build');
if (fs.existsSync(distPath)) {
  // Only delete the contents, but not the .git folder
  const files = fs.readdirSync(distPath);
  files.forEach((file) => {
    if (file !== '.git') {
      const filePath = path.join(distPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, {recursive: true, force: true});
      } else {
        fs.unlinkSync(filePath);
      }
    }
  });
} else {
  fs.mkdirSync(distPath, {recursive: true});
}

// Build background script
console.log('📦 Building background script...');
execSync('npm run build:background', {stdio: 'inherit'});

// Build content script
console.log('📦 Building content script...');
execSync('npm run build:content', {stdio: 'inherit'});

// Build popup
console.log('📦 Building popup...');
execSync('npm run build:popup', {stdio: 'inherit'});

// // Build popup material styles
// console.log('📦 Building popup material styles...');
// execSync('npm run build:popup:material', {stdio: 'inherit'});

// Copy manifest
console.log('📋 Copying manifest...');
fs.copyFileSync(
  path.join(__dirname, '../src/manifest.json'),
  path.join(distPath, 'manifest.json')
);

// Copy assets if they exist
const assetsPath = path.join(__dirname, '../src/assets');
if (fs.existsSync(assetsPath)) {
  console.log('🎨 Copying assets...');
  fs.cpSync(assetsPath, path.join(distPath, 'assets'), {recursive: true});
}

// Copy README.md if it exists
const readmePath = path.join(__dirname, '../src/README.md');
if (fs.existsSync(readmePath)) {
  console.log('📄 Copying README.md...');
  fs.copyFileSync(readmePath, path.join(distPath, 'README.md'));
}

console.log('\n✅ Build completed successfully!');
console.log(`📁 Output: ${distPath}`);
