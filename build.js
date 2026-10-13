import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy src directory
copyDir(path.join(__dirname, 'src'), path.join(outDir, 'src'));

// Copy and adjust index.html
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// index.html uses /src/style.css and /src/main.js which match relative paths in dist
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

console.log('Build completed successfully. Assets copied to dist/');
