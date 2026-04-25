import { AIProvider } from './ai-provider.js';
export class GraphQLGenerator {
    ai;
    constructor() {
        this.ai = new AIProvider();
    }
    async generateQuery(prompt, context) {
        const apiVersion = context.shopifyApiVersion || '2024-10';
        const enhancedPrompt = `
Generate a Shopify GraphQL query for: "${prompt}"

Requirements:
- API Version: ${apiVersion}
- Use fragments for reusability
- Include pagination with first/after
- Return MoneyV2 objects for prices
- Use proper aliases if needed
- Include pageInfo for pagination

Return as JSON array with {path, content, language="graphql"}

Example structure:
{
  "path": "src/queries/getProducts.graphql",
  "content": "query GetProducts($first: Int!, $after: String) { ... }",
  "language": "graphql"
}
`;
        return this.ai.generate(enhancedPrompt, context);
    }
    async generateMutation(prompt, context) {
        const apiVersion = context.shopifyApiVersion || '2024-10';
        const enhancedPrompt = `
Generate a Shopify GraphQL mutation for: "${prompt}"

Requirements:
- API Version: ${apiVersion}
- Use proper mutation syntax with input types
- Include userErrors for validation
- Use appropriate input types (CartInput, CheckoutCreateInput, etc.)
- Include required variables with proper types

Return as JSON array with {path, content, language="graphql"}
`;
        return this.ai.generate(enhancedPrompt, context);
    }
    // Pre-built query templates
    static QUERY_TEMPLATES = {
        getProducts: `
      fragment ProductFields on Product {
        id
        title
        handle
        descriptionHtml
        vendor
        productType
        tags
        availableForSale
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        images(first: 5) {
          edges {
            node { id url altText width height }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            }
          }
        }
      }

      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node { ...ProductFields }
          }
        }
      }
    `,
        getProductByHandle: `
      fragment ProductFields on Product {
        id
        title
        handle
        descriptionHtml
        vendor
        availableForSale
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 10) {
          edges { node { id url altText } }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              availableForSale
              quantityAvailable
              selectedOptions { name value }
            }
          }
        }
      }

      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) { ...ProductFields }
      }
    `,
        getCustomerOrders: `
      fragment OrderFields on Order {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
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

      query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          orders(first: $first, sortKey: CREATED_AT, reverse: true) {
            edges { node { ...OrderFields } }
          }
        }
      }
    `,
        getCollections: `
      query GetCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              image { id url altText }
              products(first: 4) {
                edges {
                  node {
                    title
                    handle
                    images(first: 1) {
                      edges { node { url altText } }
                    }
                    priceRange {
                      minVariantPrice { amount currencyCode }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    };
    static MUTATION_TEMPLATES = {
        createCart: `
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              subtotalAmount { amount currencyCode }
              totalAmount { amount currencyCode }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        addToCart: `
      mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  cost { totalAmount { amount currencyCode } }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product { title }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        updateCart: `
      mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        removeFromCart: `
      mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        createCustomer: `
      mutation CreateCustomer($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        createCustomerAccessToken: `
      mutation CreateAccessToken($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
        updateCustomer: `
      mutation UpdateCustomer($customerAccessToken: String!, $input: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    };
}
//# sourceMappingURL=graphql-generator.js.map