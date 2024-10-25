#!/usr/bin/env node

import { Command } from 'commander';
import { getPackageVersion } from './utils.js';
import { updateVersionInFile } from './updateVersion.js';

const program = new Command();

program
  .name('wp-update-version')
  .version(getPackageVersion(), '-v, --version')
  .option('-m, --main-file <filename>', 'Specify the main file name to be updated')
  .option('-c, --constant <constant>', 'Specify the constant to be updated in main file (ignored if empty)')
  .option('-p, --package-file <filename>', 'Specify the package.json file to use');

interface ProgramOptions {
  mainFile: string;
  packageFile?: string;
  constant?: string;
}

program.parse();

let { mainFile, constant, packageFile } = program.opts<ProgramOptions>();

if (mainFile == null || mainFile === '') {
  mainFile = 'main-plugin.php'; // TODO get process.cwd() instead = plugin/theme slug
}

updateVersionInFile(mainFile, constant, packageFile);
