import { describe, it, expect } from 'vitest';
import {
  updatePHPHeaderVersion,
  updateCSSHeaderVersion,
  updatePHPConstantVersion
} from './updateVersion.ts';

describe('Version Update Functions', () => {
  describe('updatePHPHeaderVersion', () => {
    it('should update version in PHP header comment', () => {
      const input = `<?php
/**
 * Plugin Name: Test Plugin
 * Version: 1.0.0
 * Description: Test
 */`;
      const expected = `<?php
/**
 * Plugin Name: Test Plugin
 * Version: 2.0.0
 * Description: Test
 */`;

      const result = updatePHPHeaderVersion(input, '2.0.0');
      expect(result).toBe(expected);
    });

    it('should handle missing version in header', () => {
      const input = `<?php
/**
 * Plugin Name: Test Plugin
 * Description: Test
 */`;

      const result = updatePHPHeaderVersion(input, '2.0.0');
      expect(result).toBe(input);
    });
  });

  describe('updateCSSHeaderVersion', () => {
    it('should update version in CSS header comment', () => {
      const input = `/*
 * Theme Name: Test Theme
 * Version: 1.0.0
 * Description: Test
 */`;
      const expected = `/*
 * Theme Name: Test Theme
 * Version: 2.0.0
 * Description: Test
 */`;

      const result = updateCSSHeaderVersion(input, '2.0.0');
      expect(result).toBe(expected);
    });

    it('should handle missing version in header', () => {
      const input = `/*
 * Theme Name: Test Theme
 * Description: Test
 */`;

      const result = updateCSSHeaderVersion(input, '2.0.0');
      expect(result).toBe(input);
    });
  });

  describe('updatePHPConstantVersion', () => {
    it('should update define() constant version', () => {
      const input = 'define(\'PLUGIN_VERSION\', \'1.0.0\');';
      const expected = 'define(\'PLUGIN_VERSION\', \'2.0.0\');';

      const result = updatePHPConstantVersion(input, '2.0.0', 'PLUGIN_VERSION');
      expect(result).toBe(expected);
    });

    it('should update const version', () => {
      const input = 'const PLUGIN_VERSION = \'1.0.0\';';
      const expected = 'const PLUGIN_VERSION = \'2.0.0\';';

      const result = updatePHPConstantVersion(input, '2.0.0', 'PLUGIN_VERSION');
      expect(result).toBe(expected);
    });

    it('should handle multiple version constants', () => {
      const input = `
        define('PLUGIN_VERSION', '1.0.0');
        const PLUGIN_VERSION = '1.0.0';
      `;
      const expected = `
        define('PLUGIN_VERSION', '2.0.0');
        const PLUGIN_VERSION = '2.0.0';
      `;

      const result = updatePHPConstantVersion(input, '2.0.0', 'PLUGIN_VERSION');
      expect(result).toBe(expected);
    });
  });
});
