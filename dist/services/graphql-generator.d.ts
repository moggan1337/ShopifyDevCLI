import type { GeneratedFile } from '../types.js';
export declare class GraphQLGenerator {
    private ai;
    constructor();
    generateQuery(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    generateMutation(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    static readonly QUERY_TEMPLATES: {
        getProducts: string;
        getProductByHandle: string;
        getCustomerOrders: string;
        getCollections: string;
    };
    static readonly MUTATION_TEMPLATES: {
        createCart: string;
        addToCart: string;
        updateCart: string;
        removeFromCart: string;
        createCustomer: string;
        createCustomerAccessToken: string;
        updateCustomer: string;
    };
}
//# sourceMappingURL=graphql-generator.d.ts.map