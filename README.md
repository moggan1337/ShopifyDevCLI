# ShopifyDev CLI

<p align="center">
  <img src="https://img.shields.io/badge/Shopify-App%20Development-95BF47?style=for-the-badge&logo=shopify&logoColor=white" alt="Shopify">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

> 🤖 **AI-Powered Shopify App Development** - Generate Shopify apps, webhooks, GraphQL queries, and Liquid templates from natural language. Built on Claude Code patterns.

## ✨ Features

### AI-Powered Development
- 🧠 **Natural Language to Code** - Describe what you want, get working code
- 📝 **GraphQL Generator** - Describe your data needs, get optimized queries
- 🎣 **Webhook Builder** - Auto-generate webhook handlers with retry logic
- 📄 **Liquid Template Gen** - Create themes/snippets from descriptions
- 🔍 **Debug Assistant** - Analyze errors, suggest fixes

### App Scaffolding
- 🚀 **App Templates** - Custom apps, theme apps, Checkout extensions
- 📦 **Dependencies** - Auto-install and configure Shopify SDKs
- 🔑 **API Keys** - Interactive setup for Partner Dashboard
- 🌐 **Ngrok/Localtunnel** - Automatic tunnel for local development

### Development Tools
- 🔄 **Hot Reload** - Watch files, rebuild on change
- 📊 **API Explorer** - Interactive GraphQL/REST explorer
- 🧪 **Mock Data** - Generate realistic test data
- 📡 **Webhook Inspector** - View/inspect webhook payloads
- 📝 **Logger** - Structured logging with Shopify context

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ShopifyDev CLI                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Command Layer                           │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │   │
│  │  │  init  │ │  gen   │ │deploy  │ │ test   │ │  debug  │ │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                   AI Service Layer                            │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Claude Code Integration                                  │ │ │
│  │  │ - Prompt Engineering                                     │ │ │
│  │  │ - Code Generation                                        │ │ │
│  │  │ - Context Management                                     │ │ │
│  │  │ - Multi-file Editing                                     │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                   Shopify API Layer                           │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐ │ │
│  │  │ GraphQL  │ │   REST    │ │ Webhooks  │ │  Theme/Liquid │ │ │
│  │  │  Client  │ │  Client   │ │  Handler  │ │    Client     │ │ │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴──────────────────────────────────┐ │
│  │                   Shopify Platform                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │ │
│  │  │   Store     │ │   Partner  │ │   Theme Editor          │ │ │
│  │  │   API       │ │   API      │ │   / Dev Tools           │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Installation

```bash
# npm (recommended)
npm install -g @shopify/dev-cli

# or using npx (no install)
npx @shopify/dev-cli init my-app

# Verify installation
shopify --version
```

## 🚀 Quick Start

```bash
# 1. Initialize a new Shopify app
shopify init my-shopify-app

# 2. Navigate to project
cd my-shopify-app

# 3. Start development server
shopify dev

# 4. Generate code with AI
shopify generate "add a product carousel to the home page"
```

## 🛠️ Commands

### `shopify init`

```bash
# Create a new Shopify app
shopify init my-app [options]

Options:
  --template <name>     App template (node, ruby, php, python)
  --app-type <type>     App type (custom, theme, checkout)
  --name <name>         App name
  --store <domain>      Development store domain
```

### `shopify generate`

```bash
# Generate GraphQL query
shopify generate query "get all products with variants and images"

# Generate webhook handler
shopify generate webhook "handle order creation"

# Generate React component
shopify generate component "product card with add to cart"

# Generate Liquid snippet
shopify generate liquid "announcement bar"
```

### `shopify dev`

```bash
# Start development with tunneling
shopify dev

# Options:
--port <number>         Local port (default: 8081)
--tunnel <provider>    Tunnel provider (ngrok, localtunnel)
--store <domain>        Override default store
```

### `shopify test`

```bash
# Run all tests
shopify test

# Run with coverage
shopify test --coverage

# Run specific test file
shopify test __tests__/products.test.js
```

## 💡 Usage Examples

### Generate a GraphQL Query

```bash
$ shopify generate query "fetch customer orders with line items"

✓ Generated: src/queries/getCustomerOrders.graphql
```

Generated output:
```graphql
query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
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
        }
      }
    }
  }
}
```

### Create a Webhook Handler

```bash
$ shopify generate webhook "order paid - send confirmation email and update inventory"

✓ Generated: src/webhooks/orderPaid.ts
✓ Generated: src/services/emailService.ts
✓ Generated: src/services/inventoryService.ts
```

### Build a Custom Section

```bash
$ shopify generate section "featured collection with 4 products and a 'View All' link"

✓ Generated: sections/featured-collection.liquid
✓ Generated: snippets/product-card.liquid
```

## 📁 Generated Project Structure

```
my-shopify-app/
├── src/
│   ├── app/                    # Next.js / Node app
│   │   ├── app/               # Routes (Next.js App Router)
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities
│   │   └── routes/            # API routes
│   ├── queries/               # GraphQL queries
│   ├── mutations/             # GraphQL mutations
│   ├── webhooks/              # Webhook handlers
│   ├── services/              # Business logic
│   └── types/                 # TypeScript types
├── scripts/                   # CLI scripts
├── tests/                    # Test files
├── shopify.app.toml          # Shopify config
└── package.json
```

## 🔧 Configuration

### shopify.app.toml

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
```

### .shopify/

```
/.shopify/
├── config.yml          # CLI configuration
├── store.json          # Connected store info
└── tokens/             # Encrypted tokens (gitignored)
```

## 🔐 Environment Variables

```env
SHOPIFY_API_KEY=xxxxx
SHOPIFY_API_SECRET=xxxxx
SHOPIFY_SCOPES=read_products,write_products,etc
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
```

## 🧪 Testing

```bash
# Unit tests
shopify test unit

# Integration tests (requires dev store)
shopify test integration

# E2E tests with Playwright
shopify test e2e

# Mock tests (no store required)
shopify test mock
```

## 🤝 Integrations

| Integration | Description |
|-------------|-------------|
| **Claude Code** | AI code generation |
| **Ngrok** | Local tunneling |
| **Polaris** | Shopify component library |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest/Vitest** | Testing |
| **Playwright** | E2E testing |

## 📚 Documentation

- [Getting Started](docs/getting-started.md)
- [GraphQL API](docs/graphql.md)
- [Webhooks](docs/webhooks.md)
- [Theme Development](docs/themes.md)
- [Deployment](docs/deployment.md)
- [Examples](docs/examples/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Run tests: `npm test`
4. Commit your changes
5. Push to the branch
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Shopify](https://shopify.dev) for APIs and documentation
- [Claude Code](https://claude.ai/code) for AI patterns
- [oclif](https://github.com/oclif) for CLI framework

---

<p align="center">
  Built with ❤️ for Shopify developers
</p>
