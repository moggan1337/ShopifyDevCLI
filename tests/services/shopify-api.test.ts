import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ShopifyAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com';
      process.env.SHOPIFY_ACCESS_TOKEN = 'test-token';

      const { ShopifyAPI } = require('../src/services/shopify-api.js');
      const api = new ShopifyAPI();

      expect(api).toBeDefined();
    });
  });
});
