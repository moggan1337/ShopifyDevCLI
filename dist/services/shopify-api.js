import { GraphQLClient, gql } from 'graphql-request';
export class ShopifyAPI {
    store;
    accessToken;
    apiVersion;
    client;
    constructor() {
        this.store = process.env.SHOPIFY_STORE_DOMAIN || '';
        this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';
        this.apiVersion = '2024-10';
        this.client = this.createClient();
    }
    createClient() {
        const endpoint = `https://${this.store}/admin/api/${this.apiVersion}/graphql.json`;
        return new GraphQLClient(endpoint, {
            headers: {
                'X-Shopify-Access-Token': this.accessToken,
                'Content-Type': 'application/json',
            },
        });
    }
    async query(queryString, variables) {
        return this.client.request(gql `${queryString}`, variables);
    }
    async getProducts(first = 10) {
        return this.query(`
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
    async getProductByHandle(handle) {
        return this.query(`
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
        return this.query(`
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
    async createWebhookSubscription(topic, uri) {
        return this.query(`
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
        return this.query(`
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
    async deleteWebhookSubscription(id) {
        return this.query(`
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
        return this.query(`
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
    async startWebhookListener(topic) {
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
//# sourceMappingURL=shopify-api.js.map