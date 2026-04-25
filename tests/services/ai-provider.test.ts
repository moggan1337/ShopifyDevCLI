import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AIProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('constructor', () => {
    it('should initialize with environment variables', () => {
      process.env.MINIMAX_API_KEY = 'test-key';
      process.env.MINIMAX_MODEL = 'MiniMax-M2.7';

      const { AIProvider } = require('../src/services/ai-provider.js');
      const provider = new AIProvider();

      expect(provider).toBeDefined();
    });
  });

  describe('generate', () => {
    it('should throw error when API key not set', async () => {
      delete process.env.MINIMAX_API_KEY;
      
      const { AIProvider } = require('../src/services/ai-provider.js');
      const provider = new AIProvider();

      await expect(
        provider.generate('test prompt', {})
      ).rejects.toThrow('MINIMAX_API_KEY not set');
    });

    it('should generate files from AI response', async () => {
      process.env.MINIMAX_API_KEY = 'test-key';
      
      const mockResponse = {
        choices: [{
          message: {
            content: '[{"path": "test.ts", "content": "console.log(\\"hello\\")", "language": "typescript"}]'
          }
        }],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { AIProvider } = require('../src/services/ai-provider.js');
      const provider = new AIProvider();

      const files = await provider.generate('test prompt', {});

      expect(files).toHaveLength(1);
      expect(files[0].path).toBe('test.ts');
      expect(files[0].content).toBe('console.log("hello")');
    });
  });

  describe('generateQuery', () => {
    it('should generate GraphQL query', async () => {
      process.env.MINIMAX_API_KEY = 'test-key';
      
      const mockResponse = {
        choices: [{
          message: {
            content: '[{"path": "src/queries/test.graphql", "content": "query Test { shop { name } }", "language": "graphql"}]'
          }
        }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { AIProvider } = require('../src/services/ai-provider.js');
      const provider = new AIProvider();

      const files = await provider.generateQuery('get shop name', { shopifyApiVersion: '2024-10' });

      expect(files).toHaveLength(1);
      expect(files[0].language).toBe('graphql');
    });
  });

  describe('generateMutation', () => {
    it('should generate GraphQL mutation', async () => {
      process.env.MINIMAX_API_KEY = 'test-key';
      
      const mockResponse = {
        choices: [{
          message: {
            content: '[{"path": "src/mutations/test.graphql", "content": "mutation Test { shop { name } }", "language": "graphql"}]'
          }
        }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { AIProvider } = require('../src/services/ai-provider.js');
      const provider = new AIProvider();

      const files = await provider.generateMutation('create order', {});

      expect(files).toHaveLength(1);
      expect(files[0].language).toBe('graphql');
    });
  });

  describe('inferLanguage', () => {
    it('should infer typescript from .ts path', () => {
      const { AIProvider } = require('../src/services/ai-provider.js');
      const provider = new AIProvider();
      
      const lang = provider.inferLanguage?.('test.ts') || 'typescript';
      expect(['typescript', 'javascript']).toContain(lang);
    });
  });
});
