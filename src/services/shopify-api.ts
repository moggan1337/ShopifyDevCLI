import { GraphQLClient, gql } from 'graphql-request';

export class ShopifyAPI {
  private store: string;
  private accessToken: string;
  private apiVersion: string;
  private client: GraphQLClient;

  constructor() {
    this.store = process.env.SHOPIFY_STORE_DOMAIN || '';
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';
    this.apiVersion = '2024-10';
    this.client = this.createClient();
  }

  private createClient(): GraphQLClient {
    const endpoint = `https://${this.store}/admin/api/${this.apiVersion}/graphql.json`;
    return new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  async query<T>(queryString: string, variables?: Record<string, unknown>): Promise<T> {
    return this.client.request<T>(gql`${queryString}`, variables);
  }

  async getProducts(first = 10) {
    return this.query<{
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            vendor: string;
          };
        }>;
      };
    }>(`
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              vendor
            }
          }
        }
      }
    `, { first });
  }

  async getProductByHandle(handle: string) {
    return this.query<{
      productByHandle: {
        id: string;
        title: string;
        handle: string;
        description: string;
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              price: string;
            };
          }>;
        };
      };
    }>(`
      query GetProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    `, { handle });
  }

  async getStoreInfo() {
    return this.query<{
      shop: {
        name: string;
        domain: string;
        email: string;
        currencyCode: string;
      };
    }>(`
      query GetShop {
        shop {
          name
          domain
          email
          currencyCode
        }
      }
    `);
  }

  async createWebhookSubscription(topic: string, uri: string) {
    return this.query<{
      webhookSubscriptionCreate: {
        webhookSubscription: {
          id: string;
          topic: string;
          uri: string;
        };
        userErrors: Array<{
          field: string;
          message: string;
        }>;
      };
    }>(`
      mutation WebhookSubscriptionCreate($topic: String!, $uri: String!) {
        webhookSubscriptionCreate(
          topic: $topic
          webhookSubscription: {
            topic: $topic
            uri: $uri
            format: JSON
          }
        ) {
          webhookSubscription {
            id
            topic
            uri
          }
          userErrors {
            field
            message
          }
        }
      }
    `, { topic, uri });
  }

  async listWebhookSubscriptions() {
    return this.query<{
      webhookSubscriptions: {
        edges: Array<{
          node: {
            id: string;
            topic: string;
            uri: string;
            format: string;
          };
        }>;
      };
    }>(`
      query ListWebhooks {
        webhookSubscriptions(first: 50) {
          edges {
            node {
              id
              topic
              uri
              format
            }
          }
        }
      }
    `);
  }

  async deleteWebhookSubscription(id: string) {
    return this.query<{
      webhookSubscriptionDelete: {
        deletedWebhookSubscriptionId: string;
        userErrors: Array<{
          field: string;
          message: string;
        }>;
      };
    }>(`
      mutation WebhookDelete($id: ID!) {
        webhookSubscriptionDelete(id: $id) {
          deletedWebhookSubscriptionId
          userErrors {
            field
            message
          }
        }
      }
    `, { id });
  }

  async getApiScopes() {
    return this.query<{
      apiAccessScopes: {
        availableAccessScopes: Array<{
          handle: string;
          description: string;
        }>;
      };
    }>(`
      query GetScopes {
        apiAccessScopes {
          availableAccessScopes {
            handle
            description
          }
        }
      }
    `);
  }

  async startWebhookListener(topic: string): Promise<{ close: () => void }> {
    // This would start a local HTTP server to receive webhooks
    // For now, return a mock
    console.log(`Webhook listener started for topic: ${topic}`);
    
    return {
      close: () => {
        console.log('Webhook listener closed');
      },
    };
  }
}
