#!/usr/bin/env node

import { Command } from 'commander';
import run from './main.js';
import { buildArray } from './utils.js';

const program = new Command();

program.name('wp-update-version');

program
  .option('-f, --file <file>', 'The file to be updated. Can be repeated to update multiple files.\n> Default: ./style.css (themes), ./<dirname>.php (plugins)', buildArray)
  .option('-p, --package-json <file>', 'The package.json file to read for version number. \n> Default: ./package.json')
  .option('--project-version <version>', '(Optional) Specify the new version number to apply. Overrides the value from package.json.')
  .option('--constant <constant>', '(Optional) Update constant declarations in the PHP file(s) in arguments.')
  .helpOption('-h, --help', 'Display help.');

export interface ProgramOptions {
  // mode?: 'plugin' | 'theme';
  file: string[];
  projectVersion?: string;
  packageJson?: string;
  constant?: string;
}

program.parse();

const options = program.opts<ProgramOptions>();

run(options);
