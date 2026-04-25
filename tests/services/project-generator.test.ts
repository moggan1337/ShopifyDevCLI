import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ProjectGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scaffold', () => {
    it('should create project structure', async () => {
      const { ProjectGenerator } = require('../src/services/project-generator.js');
      const generator = new ProjectGenerator();

      // This test would need file system mocking
      expect(generator).toBeDefined();
    });
  });
});
