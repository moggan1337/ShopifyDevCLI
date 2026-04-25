import { GeneratedFile } from '../types.js';
export declare class WebhookBuilder {
    generate(prompt: string, context?: Record<string, unknown>): Promise<GeneratedFile[]>;
    private extractTopic;
    private toFileName;
    private generateWebhookHandler;
    private generateRetryUtility;
    private generateVerification;
    private toHandlerName;
    private toClassName;
}
//# sourceMappingURL=webhook-builder.d.ts.map