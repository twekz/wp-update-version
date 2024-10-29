import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';

export function getFileAbsolutePath (file: string) {
  return path.resolve(process.cwd(), file);
}

export function getFileContent (filePath: string): string | undefined {
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath);
    if (file && file.toString().length > 0) {
      return file.toString();
    }
    console.log(`File ${file} seems to be empty`);
    return;
  }
  console.log(`File ${filePath} does not exist`);
}

export function getPackageVersion (filePath: string): string | undefined {
  const packageJsonStr = getFileContent(filePath);
  if (packageJsonStr != null) {
    const { version } = JSON.parse(packageJsonStr);
    return version;
  }
}

export function getVersion (packageJsonFile: string, projectVersion: string | undefined) {
  const version = projectVersion || getPackageVersion(getFileAbsolutePath(packageJsonFile));
  if (version == null) {
    throw new Error('[WPUV] No version number or valid package.json file was provided');
  }
  console.log('[WPUV] New version number to apply:', version);
  return version;
}

export function validateFileType (filePath: string): string {
  const ext = path.extname(filePath).split('.').pop();
  switch (ext) {
    case 'css':
    case 'scss':
    case 'sass':
      return 'css';
    case 'php':
      return 'php';
    default:
      throw new Error(`File ${path.basename(filePath)} has an unsupported type`);
  }
}
