import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('GraphQLGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateQuery', () => {
    it('should generate a query file', async () => {
      const { GraphQLGenerator } = require('../src/services/graphql-generator.js');
      const generator = new GraphQLGenerator();

      const files = await generator.generateQuery('get all products', {
        shopifyApiVersion: '2024-10',
      });

      expect(files).toHaveLength(1);
      expect(files[0].path).toContain('products');
      expect(files[0].language).toBe('graphql');
    });
  });

  describe('generateMutation', () => {
    it('should generate a mutation file', async () => {
      const { GraphQLGenerator } = require('../src/services/graphql-generator.js');
      const generator = new GraphQLGenerator();

      const files = await generator.generateMutation('create checkout', {
        shopifyApiVersion: '2024-10',
      });

      expect(files).toHaveLength(1);
      expect(files[0].language).toBe('graphql');
    });
  });
});
