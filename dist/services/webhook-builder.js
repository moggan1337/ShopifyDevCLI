export class WebhookBuilder {
    async generate(prompt, context = {}) {
        const topic = this.extractTopic(prompt);
        const files = [];
        files.push({
            path: `src/webhooks/${this.toFileName(topic)}.ts`,
            content: this.generateWebhookHandler(topic, context),
            language: 'typescript',
            description: `Webhook handler for ${topic}`,
        });
        if (prompt.toLowerCase().includes('retry') || prompt.toLowerCase().includes('handle')) {
            files.push({
                path: 'src/webhooks/retry.ts',
                content: this.generateRetryUtility(),
                language: 'typescript',
                description: 'Webhook retry utility with exponential backoff',
            });
        }
        files.push({
            path: 'src/webhooks/verify.ts',
            content: this.generateVerification(context),
            language: 'typescript',
            description: 'Webhook signature verification',
        });
        return files;
    }
    extractTopic(prompt) {
        const topics = [
            'orders/create', 'orders/updated', 'orders/deleted', 'orders/paid',
            'orders/cancelled', 'orders/fulfilled', 'orders/partially_fulfilled',
            'products/create', 'products/updated', 'products/deleted',
            'customers/create', 'customers/updated', 'customers/deleted',
            'checkouts/create', 'checkouts/update', 'checkouts/complete',
            'carts/create', 'carts/update',
            'inventory_levels/update', 'inventory_items/update',
            'fulfillments/create', 'fulfillments/update',
            'refunds/create', 'shop/update', 'app/uninstalled',
        ];
        const lowerPrompt = prompt.toLowerCase();
        for (const t of topics) {
            if (lowerPrompt.includes(t.replace('/', ' ')) || lowerPrompt.includes(t)) {
                return t;
            }
        }
        return 'orders/create';
    }
    toFileName(topic) {
        return topic.replace('/', '_');
    }
    generateWebhookHandler(topic, context) {
        const handlerName = this.toHandlerName(topic);
        const eventVar = topic.split('/')[1] || 'event';
        const apiVersion = String(context.shopifyApiVersion || '2024-10');
        const lines = [
            "import { json } from '@shopify/hydrogen';",
            "import { verifyWebhook } from './verify.js';",
            "import { logWebhook } from './logger.js';",
            "",
            `const API_VERSION = '${apiVersion}';`,
            "",
            "/**",
            ` * Webhook handler for ${topic}`,
            ` * @see https://shopify.dev/docs/api/webhooks/${apiVersion}`,
            " */",
            `export async function ${handlerName}(`,
            "  request: Request,",
            "  env: Env",
            "): Promise<Response> {",
            "  try {",
            "    const signature = request.headers.get('X-Shopify-Hmac-Sha256');",
            `    const webhookTopic = request.headers.get('X-Shopify-Topic') || '${topic}';`,
            "    const shopDomain = request.headers.get('X-Shopify-Shop-Domain');",
            "",
            "    if (!signature || !shopDomain) {",
            "      console.error('Missing webhook headers');",
            "      return new Response('Unauthorized', { status: 401 });",
            "    }",
            "",
            "    const payload = await request.text();",
            "    const isValid = await verifyWebhook(payload, signature, env.SHOPIFY_WEBHOOK_SECRET);",
            "",
            "    if (!isValid) {",
            "      console.error('Invalid webhook signature');",
            "      return new Response('Unauthorized', { status: 401 });",
            "    }",
            "",
            "    const data = JSON.parse(payload);",
            "    await logWebhook(webhookTopic, shopDomain, data);",
            "",
            "    switch (webhookTopic) {",
            `      case '${topic}':`,
            `        return await handle${this.toClassName(eventVar)}(data, env);`,
            "      default:",
            "        console.log('Unhandled webhook topic: ' + webhookTopic);",
            "        return json({ received: true });",
            "    }",
            "  } catch (error) {",
            "    console.error('Webhook handler error:', error);",
            "    return json({ error: 'Internal server error' }, { status: 500 });",
            "  }",
            "}",
            "",
            `async function handle${this.toClassName(eventVar)}(`,
            "  data: Record<string, unknown>,",
            "  env: Env",
            "): Promise<Response> {",
            `  console.log('Processing ${topic}:', JSON.stringify(data, null, 2));`,
            "  return json({ received: true });",
            "}",
            "",
            "// Type definitions",
            "interface Env {",
            "  SHOPIFY_WEBHOOK_SECRET: string;",
            "}",
        ];
        return lines.join('\n');
    }
    generateRetryUtility() {
        return [
            "/**",
            " * Webhook retry utility with exponential backoff",
            " */",
            "",
            "interface RetryOptions {",
            "  maxRetries?: number;",
            "  baseDelay?: number;",
            "  maxDelay?: number;",
            "}",
            "",
            "const DEFAULT_OPTIONS: Required<RetryOptions> = {",
            "  maxRetries: 3,",
            "  baseDelay: 1000,",
            "  maxDelay: 30000,",
            "};",
            "",
            "export async function withRetry<T>(",
            "  fn: () => Promise<T>,",
            "  options: RetryOptions = {}",
            "): Promise<T> {",
            "  const opts = { ...DEFAULT_OPTIONS, ...options };",
            "  let lastError: Error | undefined;",
            "",
            "  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {",
            "    try {",
            "      return await fn();",
            "    } catch (error) {",
            "      lastError = error instanceof Error ? error : new Error(String(error));",
            "      ",
            "      if (attempt < opts.maxRetries) {",
            "        const delay = Math.min(",
            "          opts.baseDelay * Math.pow(2, attempt),",
            "          opts.maxDelay",
            "        );",
            '        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);',
            "        await sleep(delay);",
            "      }",
            "    }",
            "  }",
            "",
            "  throw lastError;",
            "}",
            "",
            "function sleep(ms: number): Promise<void> {",
            "  return new Promise(resolve => setTimeout(resolve, ms));",
            "}",
            "",
            "export async function queueWebhook(",
            "  topic: string,",
            "  payload: Record<string, unknown>,",
            "  env: Env",
            "): Promise<void> {",
            '  const queueKey = `webhook:${topic}:${Date.now()}`;',
            "  console.log('Queued webhook:', queueKey);",
            "}",
        ].join('\n');
    }
    generateVerification(context) {
        const apiVersion = String(context.shopifyApiVersion || '2024-10');
        return [
            "import crypto from 'crypto';",
            "",
            `/**`,
            ` * Verify Shopify webhook signature`,
            ` * @see https://shopify.dev/docs/api/webhooks/${apiVersion}/authenticate`,
            " */",
            "export async function verifyWebhook(",
            "  body: string,",
            "  signature: string,",
            "  secret: string",
            "): Promise<boolean> {",
            "  if (!secret) {",
            '    console.warn("SHOPIFY_WEBHOOK_SECRET not set, skipping verification");',
            "    return true;",
            "  }",
            "",
            "  const hash = crypto",
            "    .createHmac('sha256', secret)",
            "    .update(body, 'utf8')",
            "    .digest('base64');",
            "",
            "  try {",
            "    return crypto.timingSafeEqual(",
            "      Buffer.from(hash),",
            "      Buffer.from(signature)",
            "    );",
            "  } catch {",
            "    return false;",
            "  }",
            "}",
            "",
            "/**",
            " * Verify Shopify OAuth callback",
            " */",
            "export function verifyHmac(",
            "  params: Record<string, string>,",
            "  secret: string",
            "): boolean {",
            "  const { hmac, ...rest } = params;",
            "  ",
            "  if (!hmac || !secret) return false;",
            "",
            "  const message = Object.keys(rest)",
            "    .sort()",
            '    .map(key => key + "=" + rest[key])',
            "    .join('&');",
            "",
            "  const hash = crypto",
            "    .createHmac('sha256', secret)",
            "    .update(message)",
            "    .digest('hex');",
            "",
            "  return hash === hmac;",
            "}",
        ].join('\n');
    }
    toHandlerName(topic) {
        const parts = topic.split('/');
        return 'handle' + this.toClassName(parts[0] ?? 'resource') + this.toClassName(parts[1] ?? 'event');
    }
    toClassName(str) {
        return str
            .split(/[_-]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }
}
//# sourceMappingURL=webhook-builder.js.map