import { GeneratedFile } from '../types.js';
export declare class LiquidGenerator {
    private theme;
    generate(prompt: string, context: Record<string, unknown>): Promise<GeneratedFile[]>;
    private generateSection;
    private generateSnippet;
    private generateLayout;
    private generateComponent;
    private extractSectionName;
    private extractSnippetName;
    private extractComponentName;
    private generateSchema;
    private generateSectionTemplate;
    private generateSnippetTemplate;
    private generateLayoutTemplate;
    private generateComponentTemplate;
}
//# sourceMappingURL=liquid-generator.d.ts.map