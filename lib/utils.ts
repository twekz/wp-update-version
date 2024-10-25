import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';

export function getFileAbsolutePath (file: string) {
  return path.resolve(process.cwd(), file);
}

export function getFileContent (filePath: string): string {
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath);
    if (file) {
      return file.toString();
    }
    return '';
  } else {
    throw new Error(`File ${filePath} does not exist`);
  }
}

export function getPackageVersion (packageFilePath?: string): string {
  const filePath = packageFilePath != null ? packageFilePath : getFileAbsolutePath('package.json');
  const packageJsonStr = getFileContent(filePath);
  const { version } = JSON.parse(packageJsonStr);
  return version;
}
