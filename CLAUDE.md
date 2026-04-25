# ShopifyDevCLI - Development Guide

## Project Overview

**ShopifyDevCLI** is an AI-powered CLI tool for Shopify app development. It provides commands for scaffolding projects, generating code (GraphQL queries, mutations, webhooks, React components, Liquid templates), and managing Shopify app development workflows.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20+, TypeScript 5.6 |
| **CLI Framework** | oclif 4 |
| **AI Provider** | MiniMax API (MiniMax-M2.7 model) |
| **Package Manager** | npm |

## Project Structure

```
ShopifyDevCLI/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   ├── index.ts            # Module exports
│   ├── types.ts            # TypeScript interfaces
│   └── services/
│       ├── ai-provider.ts      # AI code generation (MiniMax)
│       ├── shopify-api.ts      # Shopify API client
│       ├── project-generator.ts # App scaffolding
│       ├── graphql-generator.ts # GraphQL query/mutation generation
│       ├── webhook-builder.ts  # Webhook handler generation
│       ├── liquid-generator.ts # Liquid template generation
│       └── file-manager.ts     # File operations
├── tests/
│   ├── services/
│   │   ├── ai-provider.test.ts
│   │   ├── shopify-api.test.ts
│   │   ├── project-generator.test.ts
│   │   ├── graphql-generator.test.ts
│   │   ├── webhook-builder.test.ts
│   │   ├── liquid-generator.test.ts
│   │   └── file-manager.test.ts
│   └── cli.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- MiniMax API key (for AI features)
- Shopify Partner account (for app deployment)

### Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Link for local development
npm link

# Or install globally
npm install -g .
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_API_KEY` | Shopify Partner Dashboard API key | Yes |
| `SHOPIFY_API_SECRET` | Shopify API secret | Yes |
| `SHOPIFY_SCOPES` | Comma-separated OAuth scopes | Yes |
| `SHOPIFY_STORE_DOMAIN` | Development store domain | Yes |
| `SHOPIFY_ACCESS_TOKEN` | Storefront API access token | Yes |
| `MINIMAX_API_KEY` | MiniMax API key for AI | Yes |
| `MINIMAX_MODEL` | Model name (default: MiniMax-M2.7) | No |

## Commands

### `shopify init [name]`

Initialize a new Shopify app project.

```bash
shopify init my-app
shopify init my-app --template=express
```

### `shopify generate <type> <prompt>`

Generate code with AI.

```bash
shopify generate query "get all products with variants"
shopify generate mutation "create checkout with line items"
shopify generate webhook "handle order creation"
shopify generate component "product card with add to cart"
shopify generate liquid "featured collection section"
```

### `shopify dev`

Start development server with tunnel.

```bash
shopify dev
shopify dev --port=3000 --tunnel=localtunnel
```

### `shopify deploy`

Deploy app to Shopify.

```bash
shopify deploy
shopify deploy --staging
shopify deploy --dry-run
```

### `shopify test`

Run tests.

```bash
shopify test
shopify test --coverage
shopify test --watch
```

## Architecture

### AI Provider

The `AIProvider` class handles all AI code generation via MiniMax API:

- `generate()` - Generic code generation
- `generateComponent()` - React component generation
- `generateQuery()` - GraphQL query generation
- `generateMutation()` - GraphQL mutation generation

System prompts are crafted for each generation type to ensure high-quality output.

### Project Generator

The `ProjectGenerator` class scaffolds new Shopify apps:

- Reads template configurations
- Creates directory structure
- Generates configuration files
- Installs dependencies

### GraphQL Generator

The `GraphQLGenerator` class generates optimized GraphQL code:

- Analyzes prompt for data requirements
- Generates queries with fragments
- Generates mutations with input types
- Includes proper pagination

### Webhook Builder

The `WebhookBuilder` class generates webhook handlers:

- Extracts topic from prompt
- Generates handler with signature verification
- Includes retry logic utility
- Generates proper TypeScript types

### Liquid Generator

The `LiquidGenerator` class generates Shopify theme code:

- Generates sections with schema
- Generates snippets for reusability
- Generates layouts
- Generates components (cards, etc.)

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- ai-provider

# Watch mode
npm test -- --watch
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Code Style

- TypeScript strict mode enabled
- Use ESM (import/export)
- Follow existing naming conventions
- Add JSDoc comments for public methods
- Use async/await patterns

## Testing Strategy

- Unit tests for each service class
- Mock AI API responses
- Mock file system operations
- Test code generation output format

## LLM Integration

This project uses MiniMax API for AI-powered code generation:

- **Model**: MiniMax-M2.7
- **API**: MiniMax Chat Completion v2
- **Temperature**: 0.7 (creative but focused)
- **Max Tokens**: 4096

## Troubleshooting

### "MINIMAX_API_KEY not set"

Make sure to set the environment variable or run `shopify login`.

### "Shopify API error"

Check your Shopify credentials and ensure the store domain is correct.

### Build errors

Ensure Node.js 20+ is installed and run `npm install` first.
