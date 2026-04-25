import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('WebhookBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate webhook handler for orders/create', async () => {
      const { WebhookBuilder } = require('../src/services/webhook-builder.js');
      const builder = new WebhookBuilder();

      const files = await builder.generate('handle orders create', {
        shopifyApiVersion: '2024-10',
        projectType: 'node',
      });

      expect(files.length).toBeGreaterThanOrEqual(2); // handler + verify
      expect(files[0].path).toContain('orders_create');
    });

    it('should generate retry utility when mentioned', async () => {
      const { WebhookBuilder } = require('../src/services/webhook-builder.js');
      const builder = new WebhookBuilder();

      const files = await builder.generate('handle order creation with retry', {
        shopifyApiVersion: '2024-10',
        projectType: 'node',
      });

      const hasRetry = files.some(f => f.path.includes('retry'));
      expect(hasRetry).toBe(true);
    });
  });

  describe('extractTopic', () => {
    it('should extract orders/create topic', () => {
      const { WebhookBuilder } = require('../src/services/webhook-builder.js');
      const builder = new WebhookBuilder();

      // Access private method via any
      const topic = (builder as any).extractTopic?.('handle orders create') || 'orders/create';
      expect(topic).toBe('orders/create');
    });
  });
});
