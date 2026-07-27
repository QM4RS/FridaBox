import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(projectRoot, 'node_modules', '@tabler', 'icons');
const drawableRoot = path.join(projectRoot, 'app', 'src', 'main', 'res', 'drawable');
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const checkOnly = process.argv.includes('--check');

const icons = new Map([
  ['layout-grid', 'ic_fb_workspace.xml'],
  ['package', 'ic_fb_gadget.xml'],
  ['activity', 'ic_fb_runtime.xml'],
  ['settings', 'ic_fb_settings.xml'],
  ['file-import', 'ic_fb_import.xml'],
  ['apps', 'ic_fb_apps.xml'],
  ['file', 'ic_fb_file.xml'],
  ['x', 'ic_fb_close.xml'],
  ['info-circle', 'ic_fb_details.xml'],
  ['database-off', 'ic_fb_clear.xml'],
  ['trash', 'ic_fb_remove.xml'],
]);

let mismatches = 0;
for (const [iconName, outputName] of icons) {
  const sourcePath = path.join(packageRoot, 'icons', 'outline', `${iconName}.svg`);
  const svg = fs.readFileSync(sourcePath, 'utf8');
  const paths = [...svg.matchAll(/<path\s+d="([^"]+)"\s*\/>/g)].map((match) => match[1]);
  if (paths.length === 0) throw new Error(`No SVG paths found for ${iconName}`);

  const pathXml = paths.map((pathData) => [
    '    <path',
    '        android:fillColor="@android:color/transparent"',
    '        android:strokeColor="@android:color/white"',
    '        android:strokeWidth="2"',
    '        android:strokeLineCap="round"',
    '        android:strokeLineJoin="round"',
    `        android:pathData="${pathData}" />`,
  ].join('\n')).join('\n');

  const output = [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<!-- Generated from @tabler/icons ${packageJson.version}: icons/outline/${iconName}.svg -->`,
    '<vector xmlns:android="http://schemas.android.com/apk/res/android"',
    '    android:width="24dp"',
    '    android:height="24dp"',
    '    android:viewportWidth="24"',
    '    android:viewportHeight="24">',
    pathXml,
    '</vector>',
    '',
  ].join('\n');
  const outputPath = path.join(drawableRoot, outputName);

  if (checkOnly) {
    const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
    if (current.replaceAll('\r\n', '\n') !== output) {
      console.error(`${outputName} is not synchronized with @tabler/icons`);
      mismatches += 1;
    }
  } else {
    fs.writeFileSync(outputPath, output, 'utf8');
  }
}

if (mismatches > 0) process.exitCode = 1;
else console.log(`${checkOnly ? 'Verified' : 'Generated'} ${icons.size} Android vectors from @tabler/icons ${packageJson.version}`);
