export declare class ShopifyAPI {
    private store;
    private accessToken;
    private apiVersion;
    private client;
    constructor();
    private createClient;
    query<T>(queryString: string, variables?: Record<string, unknown>): Promise<T>;
    getProducts(first?: number): Promise<{
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
    }>;
    getProductByHandle(handle: string): Promise<{
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
    }>;
    getStoreInfo(): Promise<{
        shop: {
            name: string;
            domain: string;
            email: string;
            currencyCode: string;
        };
    }>;
    createWebhookSubscription(topic: string, uri: string): Promise<{
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
    }>;
    listWebhookSubscriptions(): Promise<{
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
    }>;
    deleteWebhookSubscription(id: string): Promise<{
        webhookSubscriptionDelete: {
            deletedWebhookSubscriptionId: string;
            userErrors: Array<{
                field: string;
                message: string;
            }>;
        };
    }>;
    getApiScopes(): Promise<{
        apiAccessScopes: {
            availableAccessScopes: Array<{
                handle: string;
                description: string;
            }>;
        };
    }>;
    startWebhookListener(topic: string): Promise<{
        close: () => void;
    }>;
}
//# sourceMappingURL=shopify-api.d.ts.map