import type { AIRequest, AIResponse, GeneratedFile, MiniMaxRequest, MiniMaxResponse } from '../types.js';

export class AIProvider {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.minimax.chat/v1';

  constructor() {
    this.apiKey = process.env.MINIMAX_API_KEY || '';
    this.model = process.env.MINIMAX_MODEL || 'MiniMax-M2.7';
  }

  async generate(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await this.complete(`${systemPrompt}\n\nUser: ${prompt}\n\nGenerate the requested code. Return the result as a JSON array of files with path and content fields.`);
    
    return this.parseGeneratedFiles(response.content);
  }

  async generateComponent(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]> {
    const systemPrompt = `You are a Shopify app developer. Generate React/TypeScript components for Shopify apps.

Project Context: ${JSON.stringify(context)}

Rules:
- Use TypeScript with proper types
- Follow React best practices with hooks
- Use Tailwind CSS for styling
- Import from @shopify/hydrogen-react when applicable
- Return files as JSON array with {path, content, language}

Generate the requested component.`;

    const response = await this.complete(`${systemPrompt}\n\nUser: ${prompt}`);
    
    return this.parseGeneratedFiles(response.content);
  }

  async generateQuery(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]> {
    const systemPrompt = `You are a GraphQL expert for Shopify. Generate optimized GraphQL queries.

Shopify API Version: ${context.shopifyApiVersion || '2024-10'}

Rules:
- Use proper GraphQL syntax with fragments for reusability
- Include pagination with first/after
- Request only needed fields (avoid *)
- Include price fields as MoneyV2 objects
- Use proper aliases if needed

Generate the requested GraphQL query. Return as JSON array with {path, content, language}.`;

    const response = await this.complete(`${systemPrompt}\n\nUser: ${prompt}`);
    
    return this.parseGeneratedFiles(response.content);
  }

  async generateMutation(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]> {
    const systemPrompt = `You are a GraphQL expert for Shopify. Generate GraphQL mutations.

Shopify API Version: ${context.shopifyApiVersion || '2024-10'}

Rules:
- Use proper GraphQL mutation syntax
- Include input types
- Return userErrors for validation
- Use CartInput, CheckoutCreateInput, etc. as appropriate
- Include required variables

Generate the requested mutation. Return as JSON array with {path, content, language}.`;

    const response = await this.complete(`${systemPrompt}\n\nUser: ${prompt}`);
    
    return this.parseGeneratedFiles(response.content);
  }

  private buildSystemPrompt(context: Record<string, unknown>): string {
    return `You are an expert Shopify app developer.

You generate high-quality code for:
- Next.js apps with App Router
- Express.js servers
- Theme app extensions (Liquid templates)
- Checkout extensions
- Webhook handlers
- GraphQL queries and mutations
- React components

Project type: ${context.projectType || 'unknown'}

Rules:
- Use TypeScript with strict mode
- Follow best practices for the framework
- Use environment variables for secrets
- Include error handling
- Add JSDoc comments for exports
- Use async/await patterns

Return generated files as a JSON array:
[
  {
    "path": "src/path/to/file.ts",
    "content": "file content here",
    "language": "typescript"
  }
]`;
  }

  private async complete(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('MINIMAX_API_KEY not set. Run `shopify login` or set MINIMAX_API_KEY environment variable.');
    }

    const request: MiniMaxRequest = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    };

    try {
      const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`MiniMax API error: ${response.status} - ${error}`);
      }

      const data = await response.json() as MiniMaxResponse;
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('MINIMAX_API_KEY')) {
        throw error;
      }
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseGeneratedFiles(content: string): GeneratedFile[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const files = JSON.parse(jsonMatch[0]);
        return files.map((f: Record<string, string>) => ({
          path: f.path || f.filePath,
          content: f.content || f.code,
          language: f.language || this.inferLanguage(f.path || ''),
        }));
      }
      
      // Fallback: return as single file
      return [{
        path: 'generated/output.ts',
        content,
        language: 'typescript',
      }];
    } catch {
      // Return as single file if JSON parsing fails
      return [{
        path: 'generated/output.ts',
        content,
        language: 'typescript',
      }];
    }
  }

  private inferLanguage(path: string): 'typescript' | 'javascript' | 'graphql' | 'liquid' | 'json' {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.graphql') || path.endsWith('.gql')) return 'graphql';
    if (path.endsWith('.liquid')) return 'liquid';
    return 'typescript';
  }
}
