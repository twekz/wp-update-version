import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  updatePHPHeaderVersion,
  updateCSSHeaderVersion,
  updatePHPConstantVersion
} from './updateVersion.ts';
import {
  getFileAbsolutePath,
  getFileContent,
  validateFileType,
  getVersion,
} from './utils.ts';
import main from './main.ts';
import fs from 'node:fs';
import log from './logger.ts';

// Mock the filesystem modules
vi.mock('node:fs');
vi.mock('./utils');
vi.mock('./updateVersion');

describe('Main Program Flow', () => {
  const mockCwd = '/test/path';

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.mock('./logger.ts');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handleFile function', () => {
    it('should successfully update a PHP file with constant', () => {
      // Mock the utility functions
      vi.mocked(getFileAbsolutePath).mockReturnValue('/abs/path/plugin.php');
      vi.mocked(validateFileType).mockReturnValue('php');
      vi.mocked(getFileContent).mockReturnValue('<?php\ndefine("VERSION", "1.0.0");');
      vi.mocked(updatePHPHeaderVersion).mockReturnValue('<?php\n// Updated header');
      vi.mocked(updatePHPConstantVersion).mockReturnValue('<?php\ndefine("VERSION", "2.0.0");');

      // Run main with test parameters
      main({
        file: ['plugin.php'],
        packageJson: 'package.json',
        projectVersion: '2.0.0',
        constant: 'VERSION'
      });

      // Verify all the necessary functions were called
      expect(getFileAbsolutePath).toHaveBeenCalledWith('plugin.php');
      expect(validateFileType).toHaveBeenCalledWith('/abs/path/plugin.php');
      expect(getFileContent).toHaveBeenCalledWith('/abs/path/plugin.php');
      expect(updatePHPHeaderVersion).toHaveBeenCalled();
      expect(updatePHPConstantVersion).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should successfully update a CSS file', () => {
      // Mock the utility functions
      vi.mocked(getFileAbsolutePath).mockReturnValue('/abs/path/style.css');
      vi.mocked(validateFileType).mockReturnValue('css');
      vi.mocked(getFileContent).mockReturnValue('/* Version: 1.0.0 */');
      vi.mocked(updateCSSHeaderVersion).mockReturnValue('/* Version: 2.0.0 */');

      // Run main with test parameters
      main({
        file: ['style.css'],
        packageJson: 'package.json',
        projectVersion: '2.0.0'
      });

      // Verify the correct functions were called
      expect(validateFileType).toHaveBeenCalledWith('/abs/path/style.css');
      expect(updateCSSHeaderVersion).toHaveBeenCalled();
      expect(updatePHPConstantVersion).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('main function', () => {
    it('should use default files when no files specified', () => {
      main({
        file: [],
        packageJson: 'package.json',
        projectVersion: '2.0.0'
      });

      // Should attempt to process style.css and {cwd}.php
      expect(getFileAbsolutePath).toHaveBeenCalledWith('style.css');
      expect(getFileAbsolutePath).toHaveBeenCalledWith(`${mockCwd}.php`);
    });

    it('should use package.json version when project version not specified', () => {
      vi.mocked(getVersion).mockReturnValue('2.0.0');

      main({
        file: ['style.css'],
        packageJson: 'package.json'
      });

      expect(getVersion).toHaveBeenCalled();
    });

    it('should handle file processing errors gracefully', () => {
      // Mock an error in file processing
      vi.mocked(getFileAbsolutePath).mockImplementation(() => {
        throw new Error('File access error');
      });

      main({
        file: ['invalid.php'],
        packageJson: 'package.json',
        projectVersion: '2.0.0'
      });

      expect(log).toHaveBeenCalledWith('Could not update', 'invalid.php');
      // Ensure the program continues even after error
      expect(process.exitCode).toBeUndefined();
    });

    it('should throw error when no version is available', () => {
      vi.mocked(getVersion).mockImplementation(() => {
        throw new Error('No version number or valid package.json file was provided');
      });

      expect(() =>
        main({
          file: ['style.css'],
          packageJson: 'invalid.json'
        })
      ).toThrow();
    });

    it('should process multiple files', () => {
      vi.mocked(getVersion).mockReturnValue('2.0.0');
      vi.mocked(getFileContent).mockReturnValue('test content');

      const files = ['style.css', 'plugin.php', 'theme.css'];

      main({
        file: files,
        packageJson: 'package.json',
        projectVersion: '2.0.0'
      });

      // Verify each file was processed
      files.forEach(file => {
        expect(getFileAbsolutePath).toHaveBeenCalledWith(file);
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete update cycle with multiple file types', () => {
      // Mock successful version retrieval
      vi.mocked(getVersion).mockReturnValue('2.0.0');

      // Mock file system operations
      vi.mocked(getFileAbsolutePath)
        .mockReturnValueOnce('/abs/path/style.css')
        .mockReturnValueOnce('/abs/path/plugin.php');

      vi.mocked(validateFileType)
        .mockReturnValueOnce('css')
        .mockReturnValueOnce('php');

      vi.mocked(getFileContent)
        .mockReturnValueOnce('/* Version: 1.0.0 */')
        .mockReturnValueOnce('<?php\ndefine("VERSION", "1.0.0");');

      // Run main with multiple files
      main({
        file: ['style.css', 'plugin.php'],
        packageJson: 'package.json',
        projectVersion: '2.0.0',
        constant: 'VERSION'
      });

      // Verify the complete flow
      expect(getVersion).toHaveBeenCalledOnce();
      expect(getFileAbsolutePath).toHaveBeenCalledTimes(2);
      expect(validateFileType).toHaveBeenCalledTimes(2);
      expect(getFileContent).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    });
  });
});
