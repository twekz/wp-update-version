import { getFileAbsolutePath, getFileContent, getVersion, validateFileType } from './utils.js';
import {
  updateCSSHeaderVersion,
  updatePHPConstantVersion,
  updatePHPHeaderVersion
} from './updateVersion.js';
import { ProgramOptions } from './index.js';
import fs from 'node:fs';

/**
 * Get a file's content and update it
 * @param filename
 * @param constantName
 * @param version
 */
function handleFile (filename: string, version: string, constantName?: string): void {
  try {
    // Get absolute path
    const filePath = getFileAbsolutePath(filename);

    // Detect and validate file type
    const type = validateFileType(filePath);

    // Get file content
    let fileContent = getFileContent(filePath);

    if (fileContent != null) {
      // Update file header comment block (CSS or PHP)
      fileContent = type === 'css'
        ? updateCSSHeaderVersion(fileContent, version)
        : updatePHPHeaderVersion(fileContent, version);

      // Update constant declaration in PHP file
      if (type === 'php' && constantName != null) {
        fileContent = updatePHPConstantVersion(fileContent, version, constantName);
      }

      // Save file containing new values
      fs.writeFileSync(filePath, fileContent);

      console.log('[WPUV] Successfully updated file:', filename);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Main program
 * @param params - Command parameters
 */
function main (params: ProgramOptions) {
  const {
    file: _files,
    constant: constantName,
    packageJson,
    projectVersion,
  } = params;

  // Initialize files list
  let files = ['style.css', `${process.cwd()}.php`];
  if (_files != null && _files.length > 0) {
    files = _files;
  }

  // Get new version number
  const version = getVersion(packageJson, projectVersion);

  // Handle files
  files.forEach((filename) => {
    handleFile(filename, version, constantName);
  });
}

export default main;
