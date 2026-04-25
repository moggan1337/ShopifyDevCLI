import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('LiquidGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate section when prompt contains section', async () => {
      const { LiquidGenerator } = require('../src/services/liquid-generator.js');
      const generator = new LiquidGenerator();

      const files = await generator.generate('create featured collection section', {});

      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].path).toContain('section');
      expect(files[0].language).toBe('liquid');
    });

    it('should generate snippet when prompt contains snippet', async () => {
      const { LiquidGenerator } = require('../src/services/liquid-generator.js');
      const generator = new LiquidGenerator();

      const files = await generator.generate('create product card snippet', {});

      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].path).toContain('snippet');
    });

    it('should generate component when prompt contains card', async () => {
      const { LiquidGenerator } = require('../src/services/liquid-generator.js');
      const generator = new LiquidGenerator();

      const files = await generator.generate('product card component', {});

      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].language).toBe('liquid');
    });
  });

  describe('extractSectionName', () => {
    it('should extract section name from prompt', () => {
      const { LiquidGenerator } = require('../src/services/liquid-generator.js');
      const generator = new LiquidGenerator();

      const name = (generator as any).extractSectionName?.('create featured collection section');
      expect(name).toBeTruthy();
    });
  });
});
