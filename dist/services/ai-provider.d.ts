import type { GeneratedFile } from '../types.js';
export declare class AIProvider {
    private apiKey;
    private model;
    private baseUrl;
    constructor();
    generate(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    generateComponent(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    generateQuery(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    generateMutation(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    private buildSystemPrompt;
    private complete;
    private parseGeneratedFiles;
    private inferLanguage;
}
//# sourceMappingURL=ai-provider.d.ts.map