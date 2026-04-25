export interface CLIConfig {
    apiKey: string;
    apiSecret: string;
    scopes: string[];
    store: string;
    accessToken: string;
    aiModel: string;
    aiApiKey: string;
    port: number;
    tunnel: 'ngrok' | 'localtunnel';
}
export interface InitOptions {
    projectName: string;
    template: 'nextjs' | 'express' | 'theme' | 'checkout' | 'custom';
    appType: 'custom' | 'theme' | 'checkout';
    store?: string;
}
export interface GenerateOptions {
    type: 'query' | 'mutation' | 'webhook' | 'component' | 'liquid' | 'custom';
    prompt: string;
    outputDir: string;
    fileName?: string;
}
export interface DevOptions {
    port: number;
    tunnel: 'ngrok' | 'localtunnel';
    store?: string;
}
export interface DeployOptions {
    environment: 'production' | 'staging';
    dryRun?: boolean;
}
export interface TestOptions {
    coverage?: boolean;
    watch?: boolean;
    testNamePattern?: string;
}
export interface DebugOptions {
    webhook?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}
export interface GeneratedFile {
    path: string;
    content: string;
    language: 'typescript' | 'javascript' | 'graphql' | 'liquid' | 'json';
    description?: string;
}
export interface ShopifyStore {
    store: string;
    accessToken: string;
    loggedInAt: string;
}
export interface AIRequest {
    prompt: string;
    context: Record<string, unknown>;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}
export interface AIResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export interface TemplateConfig {
    name: string;
    description: string;
    files: TemplateFile[];
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
}
export interface TemplateFile {
    path: string;
    content: string;
}
export interface GraphQLQuery {
    name: string;
    query: string;
    variables?: Record<string, unknown>;
    description?: string;
}
export interface GraphQLMutation {
    name: string;
    mutation: string;
    variables?: Record<string, unknown>;
    description?: string;
}
export interface WebhookSubscription {
    topics: string[];
    uri: string;
    format: 'json' | 'xml';
}
export interface WebhookHandler {
    topic: string;
    handler: string;
    retries?: number;
}
export interface ShopifyAppConfig {
    name: string;
    clientId: string;
    apiVersion: string;
    appProxy?: {
        url: string;
        subpath: string;
        prefix: string;
    };
    webhooks: {
        apiVersion: string;
        subscriptions: Array<{
            name: string;
            uri: string;
            topics: string[];
        }>;
    };
}
export interface MiniMaxMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface MiniMaxRequest {
    model: string;
    messages: MiniMaxMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}
export interface MiniMaxResponse {
    id: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export type CLIAction = 'init' | 'generate' | 'dev' | 'deploy' | 'test' | 'debug' | 'login' | 'logout' | 'whoami' | 'app' | 'help';
//# sourceMappingURL=types.d.ts.map