import type { InitOptions } from '../types.js';
export declare class ProjectGenerator {
    private fileManager;
    constructor();
    scaffold(options: InitOptions): Promise<void>;
    private getTemplate;
    private createPackageJson;
    private createShopifyConfig;
}
//# sourceMappingURL=project-generator.d.ts.map