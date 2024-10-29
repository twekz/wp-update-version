#!/usr/bin/env node

import { Command } from 'commander';
import run from './main.js';
import { buildArray } from './utils.js';

const program = new Command();

program.name('wp-update-version');

program
  .option('--file <file>', 'Specify the file to be updated. Can be repeated to update multiple files.\nDefaults to stuff', buildArray)
  .option('--package-json <file>', 'specify the package.json file to use', 'package.json')
  .option('--project-version <version>', 'specify the desired version')
  .option('--constant <constant>', 'specify the constant to be updated in main file (ignored if empty)');

export interface ProgramOptions {
  // mode?: 'plugin' | 'theme';
  file: string[];
  projectVersion?: string;
  packageJson: string;
  constant?: string;
}

program.parse();

const options = program.opts<ProgramOptions>();

run(options);
