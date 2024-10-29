import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import log from './logger.js';

describe('Logger Function', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('log function', () => {
    it('should call console.log with custom prefix', () => {
      log('Hello world!');

      expect(console.log).toHaveBeenCalledWith(
        '[wp-update-version]',
        'Hello world!'
      );
    });

    it('should log all arguments', () => {
      log('Hello', 'foo', 'bar');

      expect(console.log).toHaveBeenCalledWith(
        '[wp-update-version]',
        'Hello',
        'foo',
        'bar'
      );
    });
  });
});
