# ShopifyDev CLI

<p align="center">
  <img src="https://img.shields.io/badge/Shopify-App%20Development-95BF47?style=for-the-badge&logo=shopify&logoColor=white" alt="Shopify">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" alt="AI">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/PRs-Welcome-blue?style=for-the-badge" alt="PRs Welcome">
</p>

> 🤖 **AI-Powered Shopify App Development** — Generate Shopify apps, webhooks, GraphQL queries, and Liquid templates from natural language. Built on Claude Code patterns with MiniMax AI integration.

## About

ShopifyDev CLI transforms how developers build Shopify apps. Instead of spending hours writing boilerplate code, simply describe what you need in plain English and let the AI generate production-ready code.

**Key Benefits:**
- ⚡ **10x faster development** — Generate code in seconds, not hours
- 🧠 **AI-powered** — Uses MiniMax-M2.7 model for intelligent code generation
- 📝 **Production-ready** — All generated code follows Shopify best practices
- 🔄 **Full stack** — Generate frontend, backend, GraphQL, and Liquid templates
- 🎯 **Type-safe** — Full TypeScript support with generated types

## ✨ Features

### AI-Powered Development
- 🧠 **Natural Language to Code** — Describe what you want, get working TypeScript code
- 📝 **GraphQL Generator** — Generate optimized queries and mutations from descriptions
- 🎣 **Webhook Builder** — Auto-generate webhook handlers with retry logic and signature verification
- 📄 **Liquid Template Gen** — Create Shopify theme sections, snippets, and components
- 🔍 **Debug Assistant** — Analyze errors and suggest fixes with AI

### App Scaffolding
- 🚀 **App Templates** — Custom apps, theme apps, Checkout extensions
- 📦 **Dependencies** — Auto-install and configure Shopify SDKs
- 🔑 **API Keys** — Interactive setup for Partner Dashboard credentials
- 🌐 **Local Tunnel** — Automatic ngrok/localtunnel for webhook development

### Development Tools
- 🔄 **Hot Reload** — Watch files and rebuild on change
- 📊 **API Explorer** — Interactive GraphQL/REST API explorer
- 🧪 **Mock Data** — Generate realistic test data for development
- 📡 **Webhook Inspector** — View and inspect webhook payloads
- 📝 **Structured Logger** — Logging with Shopify context and request IDs

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ShopifyDev CLI                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         Command Layer                               │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐  │  │
│  │  │  init  │  │ generate│  │ deploy │  │  test  │  │   debug    │  │  │
│  │  └────────┘  └────────┘  └────────┘  └────────┘  └────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                      AI Service Layer                              │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │              MiniMax API (MiniMax-M2.7 Model)                  │  │  │
│  │  │  • Prompt Engineering & Context Management                  │  │  │
│  │  │  • Multi-file Code Generation                                 │  │  │
│  │  │  • Shopify-specific Code Patterns                             │  │  │
│  │  │  • TypeScript/React/Liquid Output                             │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                      Shopify API Layer                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │  │
│  │  │  GraphQL   │  │   REST     │  │  Webhooks  │  │   Theme    │ │  │
│  │  │   Client   │  │   Client   │  │  Handler   │  │  / Liquid  │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                       Shopify Platform                             │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │  │
│  │  │   Store     │  │   Partner   │  │      Theme Editor        │  │  │
│  │  │    API      │  │    API      │  │      / Dev Tools         │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 📦 Installation

```bash
# npm (recommended)
npm install -g @shopify/dev-cli

# or using npx (no install required)
npx @shopify/dev-cli init my-app

# Verify installation
shopify --version

# Update to latest
npm update -g @shopify/dev-cli
```

## 🚀 Quick Start

```bash
# 1. Initialize a new Shopify app
shopify init my-shopify-app

# 2. Navigate to project directory
cd my-shopify-app

# 3. Start development server with tunnel
shopify dev

# 4. Generate code with AI
shopify generate "add a product carousel to the home page"

# 5. Deploy when ready
shopify deploy
```

## 🛠️ Commands Reference

### `shopify init`

Create a new Shopify app project.

```bash
shopify init <app-name> [options]

Options:
  --template <name>     App template: node, express, next, remix (default: node)
  --app-type <type>     App type: custom, theme, checkout (default: custom)
  --name <name>         App display name
  --store <domain>      Development store domain (optional)
  --typescript          Use TypeScript (default: true)
```

**Examples:**
```bash
# Create a Next.js custom app
shopify init my-storefront --template=next --app-type=custom

# Create an Express backend app
shopify init my-api --template=express

# Create a theme app extension
shopify init my-theme-extension --template=node --app-type=theme
```

### `shopify generate`

Generate code using AI.

```bash
shopify generate <type> <description>

Types:
  query        Generate GraphQL query
  mutation     Generate GraphQL mutation
  webhook     Generate webhook handler
  component   Generate React component
  liquid      Generate Liquid template
  api         Generate API route
```

**Examples:**
```bash
# Generate a GraphQL query
shopify generate query "get all products with variants, images, and collections"

# Generate a webhook handler
shopify generate webhook "handle order creation - send confirmation email and update inventory"

# Generate a React component
shopify generate component "product card with image, title, price, and add to cart button"

# Generate a Liquid section
shopify generate liquid "featured collection with 4 products in a grid"
```

### `shopify dev`

Start the development server.

```bash
shopify dev [options]

Options:
  --port <number>       Local port (default: 8081)
  --tunnel <provider>  Tunnel provider: ngrok, localtunnel (default: ngrok)
  --store <domain>     Override default store
  --skip-tunnel       Run without tunnel (webhooks won't work)
```

### `shopify deploy`

Deploy your app to Shopify.

```bash
shopify deploy [options]

Options:
  --staging          Deploy to Shopify Partners staging
  --production       Deploy to Shopify Partners production
  --dry-run          Show what would be deployed
```

### `shopify test`

Run tests.

```bash
shopify test [options] [pattern]

Options:
  --coverage         Generate coverage report
  --watch            Run in watch mode
  --unit             Run unit tests only
  --integration      Run integration tests (requires dev store)
```

## 💡 Usage Examples

### Generate a GraphQL Query

```bash
$ shopify generate query "fetch customer orders with line items, shipping address, and payment status"

✓ Analyzing data requirements...
✓ Generating GraphQL query...
✓ Generated: src/queries/getCustomerOrders.graphql
```

**Generated output:**
```graphql
query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    firstName
    lastName
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  title
                  price { amount currencyCode }
                  image { url altText }
                }
              }
            }
          }
          shippingAddress {
            address1
            city
            province
            zip
            country
          }
        }
      }
    }
  }
}
```

### Create a Webhook Handler

```bash
$ shopify generate webhook "order paid - verify payment, send confirmation email, update inventory, trigger fulfillment"

✓ Analyzing webhook requirements...
✓ Generating webhook handler...
✓ Generated: src/webhooks/orders/paid.ts
✓ Generated: src/services/emailService.ts
✓ Generated: src/services/inventoryService.ts
✓ Generated: src/services/fulfillmentService.ts
```

### Build a Custom Theme Section

```bash
$ shopify generate liquid "featured collection with 4 products, title, description, and 'View All' button"

✓ Generating Liquid template...
✓ Generated: sections/featured-collection.liquid
✓ Generated: snippets/product-card.liquid
✓ Generated: styles/featured-collection.css
```

## 📁 Generated Project Structure

```
my-shopify-app/
├── src/
│   ├── app/                    # Next.js / Express app
│   │   ├── routes/            # API routes
│   │   ├── components/        # React components
│   │   └── pages/            # Pages (if using Next.js)
│   ├── queries/               # GraphQL queries
│   ├── mutations/             # GraphQL mutations
│   ├── webhooks/              # Webhook handlers
│   │   └── orders/
│   │       └── paid.ts
│   ├── services/              # Business logic
│   │   ├── emailService.ts
│   │   └── inventoryService.ts
│   └── types/                 # TypeScript types
│       └── shopify.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── shopify.app.toml           # Shopify app configuration
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### `shopify.app.toml`

```toml
name = "my-shopify-app"
client_id = "xxxxx"

[app_proxy]
url = "https://myapp.com"
subpath = "apps/myapp"
prefix = "/apps"

[webhooks]
api_version = "2024-10"

[[webhooks.subscriptions]]
name = "orders/create"
uri = "/webhooks/orders/create"

[[webhooks.subscriptions]]
name = "orders/updated"
uri = "/webhooks/orders/updated"

[[webhooks.subscriptions]]
name = "products/create"
uri = "/webhooks/products/create"
```

### `.shopify/` Directory

```
/.shopify/
├── config.yml          # CLI configuration
├── store.json          # Connected store info
└── tokens/             # Encrypted tokens (gitignored)
```

## 🔐 Environment Variables

```env
# Shopify API Credentials
SHOPIFY_API_KEY=xxxxx
SHOPIFY_API_SECRET=xxxxx
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders,etc
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx

# AI Provider
MINIMAX_API_KEY=sk-xxxxx
MINIMAX_MODEL=MiniMax-M2.7

# Tunnel (for local development)
NGROK_AUTH_TOKEN=xxxxx
```

## 🧪 Testing

```bash
# Run all tests
shopify test

# Run with coverage
shopify test --coverage

# Run specific test
shopify test ai-provider

# Watch mode
shopify test --watch

# Unit tests only
shopify test --unit

# Integration tests (requires dev store)
shopify test --integration
```

## 🤝 Integrations

| Integration | Description |
|-------------|-------------|
| **MiniMax AI** | AI-powered code generation |
| **Ngrok** | Local tunneling for webhook development |
| **Shopify Polaris** | Shopify component library |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest/Vitest** | Testing framework |
| **Playwright** | E2E testing |

## 📚 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [GraphQL API Reference](docs/graphql.md)
- [Webhooks Guide](docs/webhooks.md)
- [Theme Development](docs/themes.md)
- [Deployment Guide](docs/deployment.md)
- [Examples](docs/examples/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/ShopifyDevCLI.git`
3. **Create** a feature branch: `git checkout -b feature/amazing`
4. **Install** dependencies: `npm install`
5. **Build** the project: `npm run build`
6. **Test** your changes: `npm test`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to the branch: `git push origin feature/amazing`
9. **Open** a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2024 moggan1337

## 🙏 Acknowledgments

- [Shopify](https://shopify.dev) for APIs, documentation, and inspiration
- [oclif](https://github.com/oclif) for the CLI framework
- [MiniMax](https://minimax.chat) for AI model access
- [Claude Code](https://claude.ai/code) for AI patterns

---

<p align="center">
  Built with ❤️ for Shopify developers
</p>
