import { FileManager } from './file-manager.js';
import fs from 'fs/promises';
import path from 'path';
export class ProjectGenerator {
    fileManager;
    constructor() {
        this.fileManager = new FileManager();
    }
    async scaffold(options) {
        const template = this.getTemplate(options.template);
        // Create project directory
        const projectPath = path.join(process.cwd(), options.projectName);
        await fs.mkdir(projectPath, { recursive: true });
        // Generate files from template
        for (const file of template.files) {
            const filePath = path.join(projectPath, file.path);
            const fileDir = path.dirname(filePath);
            await fs.mkdir(fileDir, { recursive: true });
            await fs.writeFile(filePath, file.content, 'utf-8');
        }
        // Create package.json with dependencies
        const packageJson = this.createPackageJson(options, template);
        await fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
        // Create shopify.app.toml
        const shopifyConfig = this.createShopifyConfig(options);
        await fs.writeFile(path.join(projectPath, 'shopify.app.toml'), shopifyConfig);
        // Create .env.example
        await fs.writeFile(path.join(projectPath, '.env.example'), `SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=read_products,write_products
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
MINIMAX_API_KEY=your_minimax_key
MINIMAX_MODEL=MiniMax-M2.7
`);
        // Create .gitignore
        await fs.writeFile(path.join(projectPath, '.gitignore'), `node_modules/
.env
.env.local
dist/
.next/
out/
coverage/
*.log
.DS_Store
.shopify/
`);
    }
    getTemplate(templateType) {
        const templates = {
            nextjs: {
                name: 'Next.js App',
                description: 'Next.js app with App Router',
                files: [
                    {
                        path: 'src/app/layout.tsx',
                        content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shopify App',
  description: 'Built with Shopify Dev CLI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
                    },
                    {
                        path: 'src/app/page.tsx',
                        content: `export default function HomePage() {
  return (
    <main>
      <h1>Welcome to your Shopify App</h1>
    </main>
  );
}
`,
                    },
                    {
                        path: 'src/app/globals.css',
                        content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
                    },
                    {
                        path: 'src/lib/shopify.ts',
                        content: `import { GraphQLClient, gql } from 'graphql-request';

const SHOPIFY_API_URL = process.env.SHOPIFY_STORE_DOMAIN
  ? \`https://\${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json\`
  : '';

const client = new GraphQLClient(SHOPIFY_API_URL, {
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN || '',
  },
});

export { client };
`,
                    },
                    {
                        path: 'src/routes/api/hello/route.ts',
                        content: `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from Shopify App!' });
}
`,
                    },
                ],
                dependencies: {
                    next: '^15.0.0',
                    react: '^19.0.0',
                    'react-dom': '^19.0.0',
                    graphql: '^16.9.0',
                    'graphql-request': '^7.1.0',
                    tailwindcss: '^4.0.0',
                    '@tailwindcss/postcss': '^4.0.0',
                },
                devDependencies: {
                    typescript: '^5.6.0',
                    '@types/node': '^22.0.0',
                    '@types/react': '^19.0.0',
                },
                scripts: {
                    dev: 'next dev',
                    build: 'next build',
                    start: 'next start',
                    lint: 'next lint',
                },
            },
            express: {
                name: 'Express.js App',
                description: 'Node.js Express server',
                files: [
                    {
                        path: 'src/index.ts',
                        content: `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Shopify App API' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;
`,
                    },
                ],
                dependencies: {
                    express: '^4.21.0',
                    cors: '^2.8.5',
                    'graphql-request': '^7.1.0',
                },
                devDependencies: {
                    typescript: '^5.6.0',
                    '@types/express': '^5.0.0',
                    tsx: '^4.19.0',
                },
                scripts: {
                    dev: 'tsx watch src/index.ts',
                    build: 'tsc',
                    start: 'node dist/index.js',
                },
            },
            theme: {
                name: 'Theme App Extension',
                description: 'Theme app with Liquid templates',
                files: [
                    {
                        path: 'assets/theme.js',
                        content: `// Theme JavaScript
console.log('Theme loaded');
`,
                    },
                    {
                        path: 'sections/featured-collection.liquid',
                        content: `{% comment %}
  Featured Collection Section
{% endcomment %}

<div class="featured-collection">
  <h2>{{ section.settings.title }}</h2>
  <div class="product-grid">
    {% for product in collections[section.settings.collection].products limit: 4 %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
</div>

{% schema %}
{
  "name": "Featured Collection",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Featured Collection"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    }
  ],
  "presets": [
    {
      "name": "Featured Collection"
    }
  ]
}
{% endschema %}
`,
                    },
                    {
                        path: 'snippets/product-card.liquid',
                        content: `{% comment %}
  Product Card Snippet
{% endcomment %}

<div class="product-card">
  <a href="{{ product.url }}">
    <img src="{{ product.featured_image | image_url: width: 300 }}" 
         alt="{{ product.title }}" 
         loading="lazy" />
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </a>
</div>
`,
                    },
                ],
                dependencies: {},
                devDependencies: {},
            },
            checkout: {
                name: 'Checkout Extension',
                description: 'Shopify Checkout extension',
                files: [
                    {
                        path: 'src/index.ts',
                        content: `import { Extension, run } from '@shopify/checkout-extensions';

const extension = new Extension('checkout-extension', {
  targets: ['Checkout::Feature::Render'],
});

run(extension);
`,
                    },
                ],
                dependencies: {
                    '@shopify/checkout-extensions': '^1.0.0',
                },
            },
            custom: {
                name: 'Custom App',
                description: 'Empty custom app structure',
                files: [
                    {
                        path: 'src/index.ts',
                        content: `// Your custom Shopify app entry point
console.log('Shopify App initialized');
`,
                    },
                ],
                dependencies: {
                    'graphql-request': '^7.1.0',
                },
            },
        };
        return templates[templateType] ?? templates.custom;
    }
    createPackageJson(options, template) {
        return {
            name: options.projectName,
            version: '1.0.0',
            private: true,
            description: `Shopify App - ${template.name}`,
            scripts: template.scripts,
            dependencies: template.dependencies,
            devDependencies: template.devDependencies,
            engines: {
                node: '>=20.0.0',
            },
        };
    }
    createShopifyConfig(options) {
        return `[app]
name = "${options.projectName}"
client_id = "your_client_id"

[app_proxy]
url = "http://localhost:3000"
subpath = "apps/${options.projectName}"
prefix = "/apps"

[webhooks]
api_version = "2024-10"

[[webhooks.subscriptions]]
name = "orders/create"
uri = "/api/webhooks/orders/create"

[[webhooks.subscriptions]]
name = "products/create"
uri = "/api/webhooks/products/create"
`;
    }
}
//# sourceMappingURL=project-generator.js.map