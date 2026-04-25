#!/usr/bin/env node
import { McpCli } from './cli.js';
import chalk from 'chalk';
async function main() {
    const cli = new McpCli();
    try {
        await cli.run();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red(`\nError: ${error.message}`));
            if (process.env.DEBUG) {
                console.error(error.stack);
            }
        }
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map