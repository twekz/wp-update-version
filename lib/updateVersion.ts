import fs from 'node:fs';
import { getFileAbsolutePath, getFileContent, getPackageVersion } from './utils.js';

/**
 * Very simple regex for version number
 */
const VERSION_REGEX = '[.\\S]+';

/**
 * Replace version number in a comment block
 * @param fileContent
 * @param version
 */
function updateHeaderVersion (fileContent: string, version: string) {
  const commentRegex = new RegExp(`\\s*\\*\\s*(Version):\\s*(${VERSION_REGEX})\\n`);
  const commentMatch: RegExpExecArray | null = commentRegex.exec(fileContent);

  if (commentMatch != null) {
    const oldComment = commentMatch[0];
    const newComment = oldComment.slice(0).replace(commentMatch[2], version);
    fileContent = fileContent.replace(oldComment, newComment);
  }

  return fileContent;
}

/**
 * Replace version number in a PHP constant definition
 * @param fileContent
 * @param version
 * @param constant - name of the constant
 */
function updateConstantVersion (fileContent: string, version: string, constant: string) {
  const constantRegex = new RegExp(`define\\(\\s*(['"])${constant}\\1\\s*,\\s*(['"])(${VERSION_REGEX})\\2\\s*\\);`);
  const constantMatch: RegExpExecArray | null = constantRegex.exec(fileContent);

  if (constantMatch != null) {
    const oldConstant = constantMatch[0];
    const newConstant = oldConstant.slice(0).replace(constantMatch[3], version);
    fileContent = fileContent.replace(oldConstant, newConstant);
  }

  return fileContent;
}

/**
 * Get a file's content and update it
 * @param file
 * @param constant
 * @param packageFile
 */
export function updateVersionInFile (file: string, constant?: string, packageFile?: string): void {
  const version = getPackageVersion(packageFile);

  const filePath = getFileAbsolutePath(file);
  let fileContent = getFileContent(filePath);

  if (fileContent == null || fileContent === '') {
    throw new Error(`File ${file} seems to be empty`);
  }

  // Update file header version
  fileContent = updateHeaderVersion(fileContent, version);

  // Update constant definition
  if (constant != null && constant !== '') {
    fileContent = updateConstantVersion(fileContent, version, constant);
  }

  // Save file containing new values
  fs.writeFileSync(filePath, fileContent);
}
