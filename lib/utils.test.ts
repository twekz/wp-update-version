import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getFileAbsolutePath,
  getFileContent,
  validateFileType,
  getVersion,
  getPackageVersion,
  buildArray,
} from './utils.ts';
import fs from 'node:fs';
import path from 'node:path';

// Mock the filesystem modules
vi.mock('node:fs');
vi.mock('node:path');

describe('Utility Functions', () => {
  const mockCwd = '/test/path';

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getFileAbsolutePath', () => {
    it('should resolve relative path to absolute path', () => {
      vi.mocked(path.resolve).mockReturnValue('/test/path/style.css');

      const result = getFileAbsolutePath('style.css');

      expect(path.resolve).toHaveBeenCalledWith(mockCwd, 'style.css');
      expect(result).toBe('/test/path/style.css');
    });

    it('should handle absolute paths', () => {
      const absolutePath = '/absolute/path/style.css';
      vi.mocked(path.resolve).mockReturnValue(absolutePath);

      const result = getFileAbsolutePath(absolutePath);

      expect(path.resolve).toHaveBeenCalledWith(mockCwd, absolutePath);
      expect(result).toBe(absolutePath);
    });
  });

  describe('getFileContent', () => {
    it('should return file content when file exists', () => {
      const mockContent = 'test content';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(mockContent));

      expect(getFileContent('/path/to/file')).toBe(mockContent);
    });

    it('should return undefined when file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(getFileContent('/path/to/file')).toBeUndefined();
    });

    it('should return undefined for empty files', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(''));

      expect(getFileContent('/path/to/file')).toBeUndefined();
    });
  });

  describe('getPackageVersion', () => {
    it('should return version from valid package.json', () => {
      const mockPackageJson = JSON.stringify({ version: '1.0.0' });
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(mockPackageJson));

      expect(getPackageVersion('/path/to/package.json')).toBe('1.0.0');
    });

    it('should return undefined when package.json does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(getPackageVersion('/path/to/package.json')).toBeUndefined();
    });

    it('should return undefined when package.json has no version', () => {
      const mockPackageJson = JSON.stringify({ name: 'test-package' });
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(mockPackageJson));

      expect(getPackageVersion('/path/to/package.json')).toBeUndefined();
    });

    it('should handle malformed package.json', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('invalid json'));

      expect(getPackageVersion('/path/to/package.json')).toBeUndefined();
    });
  });

  describe('getVersion', () => {
    beforeEach(() => {
      vi.mocked(path.resolve).mockImplementation((_, filePath) => filePath);
    });

    it('should return provided project version when available', () => {
      const result = getVersion('package.json', '2.0.0');
      expect(result).toBe('2.0.0');
    });

    it('should fall back to package.json version when project version not provided', () => {
      const mockPackageJson = JSON.stringify({ version: '1.0.0' });
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(mockPackageJson));

      const result = getVersion('package.json', undefined);
      expect(result).toBe('1.0.0');
    });

    it('should throw error when no version is available', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(() => getVersion('package.json', undefined)).toThrow();
    });

    it('should throw error when package.json exists but has no version', () => {
      const mockPackageJson = JSON.stringify({ name: 'test-package' });
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(mockPackageJson));

      expect(() => getVersion('package.json', undefined)).toThrow();
    });
  });

  describe('validateFileType', () => {
    it('should identify CSS files', () => {
      vi.mocked(path.extname).mockReturnValue('.css');
      expect(validateFileType('style.css')).toBe('css');

      vi.mocked(path.extname).mockReturnValue('.scss');
      expect(validateFileType('style.scss')).toBe('css');

      vi.mocked(path.extname).mockReturnValue('.sass');
      expect(validateFileType('style.sass')).toBe('css');
    });

    it('should identify PHP files', () => {
      vi.mocked(path.extname).mockReturnValue('.php');
      expect(validateFileType('plugin.php')).toBe('php');
    });

    it('should throw error for unsupported file types', () => {
      vi.mocked(path.extname).mockReturnValue('.js');
      vi.mocked(path.basename).mockReturnValue('test.js');

      expect(() => validateFileType('test.js'))
        .toThrow('File test.js has an unsupported type');
    });
  });

  describe('buildArray', () => {
    it('should create new array with single value', () => {
      const result = buildArray('test.php');
      expect(result).toEqual(['test.php']);
    });

    it('should append to existing array', () => {
      const existing = ['test.php'];
      const result = buildArray('style.css', existing);
      expect(result).toEqual(['test.php', 'style.css']);
    });
  });
});
