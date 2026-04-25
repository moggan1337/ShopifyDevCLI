import {
  CLIAction,
  CLIConfig,
  ShopifyStore,
  GeneratedFile,
  GenerateOptions,
  InitOptions,
  DevOptions,
  DeployOptions,
  TestOptions,
  DebugOptions,
} from './types.js';
import { AIProvider } from './services/ai-provider.js';
import { ShopifyAPI } from './services/shopify-api.js';
import { ProjectGenerator } from './services/project-generator.js';
import { GraphQLGenerator } from './services/graphql-generator.js';
import { WebhookBuilder } from './services/webhook-builder.js';
import { LiquidGenerator } from './services/liquid-generator.js';
import { FileManager } from './services/file-manager.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execa } from 'execa';
import ora, { Ora } from 'ora';

export class McpCli {
  private config: CLIConfig;
  private ai: AIProvider;
  private shopify: ShopifyAPI;
  private projectGen: ProjectGenerator;
  private graphqlGen: GraphQLGenerator;
  private webhookBuilder: WebhookBuilder;
  private liquidGen: LiquidGenerator;
  private fileManager: FileManager;
  private spinner: Ora | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.ai = new AIProvider();
    this.shopify = new ShopifyAPI();
    this.projectGen = new ProjectGenerator();
    this.graphqlGen = new GraphQLGenerator();
    this.webhookBuilder = new WebhookBuilder();
    this.liquidGen = new LiquidGenerator();
    this.fileManager = new FileManager();
  }

  private loadConfig(): CLIConfig {
    // Load from .shopify/config.yml or default
    const homeDir = process.env.HOME || '';
    const configPath = `${homeDir}/.shopify/config.yml`;
    
    return {
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecret: process.env.SHOPIFY_API_SECRET || '',
      scopes: (process.env.SHOPIFY_SCOPES || 'read_products,write_products').split(','),
      store: process.env.SHOPIFY_STORE_DOMAIN || '',
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
      aiModel: process.env.MINIMAX_MODEL || 'MiniMax-M2.7',
      aiApiKey: process.env.MINIMAX_API_KEY || '',
      port: 8081,
      tunnel: 'ngrok',
    };
  }

  async run(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    const subcommand = args[1];

    switch (command) {
      case 'init':
        await this.init(subcommand);
        break;
      case 'generate':
      case 'gen':
        await this.generate(args.slice(2).join(' '));
        break;
      case 'dev':
        await this.dev(args.slice(2));
        break;
      case 'deploy':
        await this.deploy(args.slice(2));
        break;
      case 'test':
        await this.test(args.slice(2));
        break;
      case 'debug':
        await this.debug(args.slice(2));
        break;
      case 'login':
        await this.login();
        break;
      case 'logout':
        await this.logout();
        break;
      case 'whoami':
        await this.whoami();
        break;
      case 'app':
        await this.app(args.slice(2));
        break;
      default:
        await this.help();
    }
  }

  private async init(projectName?: string): Promise<void> {
    console.log(chalk.bold('\n🚀 Shopify App Initialization\n'));

    let answers: Partial<InitOptions> = {};

    if (!projectName) {
      answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your app name?',
          default: 'my-shopify-app',
          validate: (input: string) => {
            if (!/^[a-z0-9-]+$/.test(input)) {
              return 'App name must be lowercase letters, numbers, and hyphens only';
            }
            return true;
          },
        },
        {
          type: 'list',
          name: 'template',
          message: 'Which template would you like to use?',
          choices: [
            { name: 'Node.js (Next.js) - Recommended', value: 'nextjs' },
            { name: 'Node.js (Express)', value: 'express' },
            { name: 'Theme App Extension', value: 'theme' },
            { name: 'Checkout Extension', value: 'checkout' },
            { name: 'Custom', value: 'custom' },
          ],
          default: 'nextjs',
        },
        {
          type: 'list',
          name: 'appType',
          message: 'What type of app is this?',
          choices: [
            { name: 'Custom App', value: 'custom' },
            { name: 'Theme App (for themes)', value: 'theme' },
            { name: 'Checkout Extension', value: 'checkout' },
          ],
          default: 'custom',
        },
      ]);
    } else {
      answers.projectName = projectName;
      answers.template = 'nextjs';
      answers.appType = 'custom';
    }

    const options: InitOptions = {
      projectName: answers.projectName || 'my-shopify-app',
      template: answers.template || 'nextjs',
      appType: answers.appType || 'custom',
      store: answers.store,
    };

    this.spinner = ora('Scaffolding project...').start();
    
    try {
      await this.projectGen.scaffold(options);
      this.spinner.succeed(chalk.green(`✓ Project ${options.projectName} created!`));
      
      console.log(chalk.bold('\n📦 Next Steps:\n'));
      console.log(chalk.cyan(`  cd ${options.projectName}`));
      console.log(chalk.cyan('  shopify dev'));
      console.log('');
      
    } catch (error) {
      this.spinner?.fail(chalk.red('Failed to initialize project'));
      throw error;
    }
  }

  private async generate(prompt: string): Promise<void> {
    let options: GenerateOptions;
    
    if (!prompt) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'What would you like to generate?',
          choices: [
            { name: '📝 GraphQL Query', value: 'query' },
            { name: '📝 GraphQL Mutation', value: 'mutation' },
            { name: '🎣 Webhook Handler', value: 'webhook' },
            { name: '📄 React Component', value: 'component' },
            { name: '📄 Liquid Template/Section', value: 'liquid' },
            { name: '🧠 Custom (AI powered)', value: 'custom' },
          ],
        },
        {
          type: 'input',
          name: 'promptInput',
          message: 'Describe what you want to generate:',
          validate: (input: string) => input.length > 3 || 'Please provide a description',
        },
      ]);
      
      options = {
        type: answers.type as GenerateOptions['type'],
        prompt: answers.promptInput,
        outputDir: './src',
      };
    } else {
      options = {
        type: 'custom',
        prompt,
        outputDir: './src',
      };
    }

    this.spinner = ora('Generating code with AI...').start();
    
    try {
      const files = await this.generateWithAI(options);
      
      this.spinner.succeed(chalk.green(`✓ Generated ${files.length} file(s)!`));
      
      for (const file of files) {
        console.log(chalk.cyan(`  ✓ Generated: ${file.path}`));
      }
      
    } catch (error) {
      this.spinner?.fail(chalk.red('Generation failed'));
      throw error;
    }
  }

  private async generateWithAI(options: GenerateOptions): Promise<GeneratedFile[]> {
    // Use AI to generate code based on prompt
    const context = await this.getProjectContext();
    
    let files: GeneratedFile[] = [];
    
    switch (options.type) {
      case 'query':
        files = await this.graphqlGen.generateQuery(options.prompt, context);
        break;
      case 'mutation':
        files = await this.graphqlGen.generateMutation(options.prompt, context);
        break;
      case 'webhook':
        files = await this.webhookBuilder.generate(options.prompt, context);
        break;
      case 'component':
        files = await this.ai.generateComponent(options.prompt, context);
        break;
      case 'liquid':
        files = await this.liquidGen.generate(options.prompt, context);
        break;
      case 'custom':
      default:
        files = await this.ai.generate(options.prompt, context);
        break;
    }
    
    // Write files
    for (const file of files) {
      await this.fileManager.writeFile(file.path, file.content);
    }
    
    return files;
  }

  private async getProjectContext(): Promise<Record<string, unknown>> {
    const context: Record<string, unknown> = {
      shopifyApiVersion: '2024-10',
      projectType: 'nextjs',
    };
    
    // Try to detect project structure
    try {
      const packageJson = await this.fileManager.readFile('./package.json');
      if (packageJson) {
        const pkg = JSON.parse(packageJson);
        context.projectType = pkg.dependencies?.next ? 'nextjs' : 'express';
      }
    } catch {
      // File doesn't exist, use defaults
    }
    
    return context;
  }

  private async dev(args: string[]): Promise<void> {
    const options: DevOptions = this.parseDevOptions(args);
    
    console.log(chalk.bold('\n🔧 Starting Shopify development server...\n'));
    
    // Check if app is initialized
    if (!await this.fileManager.exists('./shopify.app.toml')) {
      console.log(chalk.yellow('⚠ No shopify.app.toml found. Run `shopify init` first.'));
      return;
    }
    
    // Start tunnel
    this.spinner = ora('Starting tunnel...').start();
    const tunnelUrl = await this.startTunnel(options.port, options.tunnel);
    this.spinner.succeed(chalk.green(`✓ Tunnel running at ${tunnelUrl}`));
    
    // Update webhook URLs
    await this.updateWebhookUrls(tunnelUrl);
    
    // Start dev server
    this.spinner = ora('Starting development server...').start();
    try {
      await execa('npm', ['run', 'dev'], {
        stdio: 'inherit',
        env: {
          ...process.env,
          SHOPIFY_TUNNEL_URL: tunnelUrl,
        },
      });
    } catch {
      this.spinner?.fail(chalk.red('Development server failed to start'));
    }
  }

  private async startTunnel(port: number, provider: string): Promise<string> {
    if (provider === 'ngrok') {
      try {
        await execa('npx', ['ngrok', 'http', String(port), '--domain', 'your-domain.ngrok.io']);
        return 'https://your-domain.ngrok.io';
      } catch {
        // Fallback to localtunnel
        const localtunnel = (await import('localtunnel')).default;
        const tunnel = await localtunnel({ port });
        return tunnel.url;
      }
    }
    
    const localtunnel = (await import('localtunnel')).default;
    const tunnel = await localtunnel({ port });
    return tunnel.url;
  }

  private parseDevOptions(args: string[]): DevOptions {
    const options: DevOptions = {
      port: 8081,
      tunnel: 'ngrok',
      store: this.config.store,
    };
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];
      if (arg === '--port' && nextArg) {
        options.port = parseInt(nextArg, 10);
        i++;
      } else if (arg === '--tunnel' && nextArg) {
        options.tunnel = nextArg as 'ngrok' | 'localtunnel';
        i++;
      } else if (arg === '--store' && nextArg) {
        options.store = nextArg;
        i++;
      }
    }
    
    return options;
  }

  private async deploy(args: string[]): Promise<void> {
    const options: DeployOptions = {
      environment: 'production',
    };
    
    for (const arg of args) {
      if (arg === '--staging') options.environment = 'staging';
      if (arg === '--dry-run') options.dryRun = true;
    }
    
    this.spinner = ora(`Deploying to ${options.environment}...`).start();
    
    try {
      // Build first
      await execa('npm', ['run', 'build']);
      
      // Deploy based on environment
      if (options.environment === 'production') {
        await execa('shopify', ['app', 'deploy']);
      } else {
        await execa('shopify', ['app', 'deploy', '--staging']);
      }
      
      this.spinner.succeed(chalk.green('✓ Deployment complete!'));
    } catch (error) {
      this.spinner?.fail(chalk.red('Deployment failed'));
      throw error;
    }
  }

  private async test(args: string[]): Promise<void> {
    const options: TestOptions = {
      coverage: args.includes('--coverage'),
      watch: args.includes('--watch'),
      testNamePattern: args.find((a) => a.startsWith('--test-name='))?.split('=')[1],
    };
    
    this.spinner = ora('Running tests...').start();
    
    try {
      const testArgs = ['test'];
      if (options.coverage) testArgs.push('--coverage');
      if (options.watch) testArgs.push('--watch');
      if (options.testNamePattern) {
        testArgs.push('--testNamePattern');
        testArgs.push(options.testNamePattern);
      }
      
      await execa('npm', testArgs, { stdio: 'inherit' });
      this.spinner.succeed(chalk.green('✓ Tests passed!'));
    } catch {
      this.spinner?.fail(chalk.red('Tests failed'));
      process.exit(1);
    }
  }

  private async debug(args: string[]): Promise<void> {
    const options: DebugOptions = {
      webhook: args.find((a) => a.startsWith('--webhook='))?.split('=')[1],
      logLevel: 'info',
    };
    
    console.log(chalk.bold('\n🔍 Shopify Debug Mode\n'));
    
    if (options.webhook) {
      console.log(chalk.cyan(`Listening for webhook: ${options.webhook}`));
      console.log(chalk.gray('Press Ctrl+C to exit\n'));
      
      // Start webhook listener
      const server = await this.shopify.startWebhookListener(options.webhook);
      
      process.on('SIGINT', () => {
        server.close();
        process.exit(0);
      });
    } else {
      // General debug mode
      console.log(chalk.yellow('Available debug options:'));
      console.log(chalk.gray('  --webhook=<name>    Debug a specific webhook'));
    }
  }

  private async login(): Promise<void> {
    console.log(chalk.bold('\n🔐 Shopify Login\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'store',
        message: 'Enter your store domain:',
        validate: (input: string) => {
          if (!input.includes('.myshopify.com') && !input.includes('shopify.com')) {
            return 'Please enter a valid Shopify store domain';
          }
          return true;
        },
      },
      {
        type: 'password',
        name: 'accessToken',
        message: 'Enter your Admin API access token:',
        mask: '*',
      },
    ]);
    
    // Save to config
    await this.fileManager.writeFile(
      `${process.env.HOME}/.shopify/store.json`,
      JSON.stringify({
        store: answers.store,
        accessToken: answers.accessToken,
        loggedInAt: new Date().toISOString(),
      }, null, 2)
    );
    
    console.log(chalk.green('\n✓ Logged in successfully!\n'));
  }

  private async logout(): Promise<void> {
    try {
      await this.fileManager.deleteFile(`${process.env.HOME}/.shopify/store.json`);
      console.log(chalk.green('\n✓ Logged out successfully!\n'));
    } catch {
      console.log(chalk.yellow('\nNo active login session found.\n'));
    }
  }

  private async whoami(): Promise<void> {
    try {
      const storeData = await this.fileManager.readFile(`${process.env.HOME}/.shopify/store.json`);
      if (storeData) {
        const store: ShopifyStore = JSON.parse(storeData);
        console.log(chalk.bold('\n👤 Logged in as:\n'));
        console.log(chalk.cyan(`  Store: ${store.store}`));
        console.log(chalk.gray(`  Since: ${new Date(store.loggedInAt).toLocaleDateString()}\n`));
      }
    } catch {
      console.log(chalk.yellow('\nNot logged in. Run `shopify login` to authenticate.\n'));
    }
  }

  private async updateWebhookUrls(baseUrl: string): Promise<void> {
    const configPath = './shopify.app.toml';
    if (await this.fileManager.exists(configPath)) {
      const configContent = await this.fileManager.readFile(configPath);
      // Update webhook URLs in config
      // This would parse TOML and update URLs
    }
  }

  private async app(args: string[]): Promise<void> {
    const subcommand = args[0];
    
    switch (subcommand) {
      case 'info':
        await this.appInfo();
        break;
      case 'config':
        await this.appConfig();
        break;
      default:
        console.log(chalk.cyan('Available app commands:'));
        console.log(chalk.gray('  shopify app info     - Show app information'));
        console.log(chalk.gray('  shopify app config   - Edit app configuration'));
    }
  }

  private async appInfo(): Promise<void> {
    try {
      const config = await this.fileManager.readFile('./shopify.app.toml');
      console.log(chalk.bold('\n📦 App Configuration:\n'));
      console.log(chalk.gray(config || 'No configuration found'));
    } catch {
      console.log(chalk.yellow('\nNo app configuration found. Run `shopify init` first.\n'));
    }
  }

  private async appConfig(): Promise<void> {
    console.log(chalk.yellow('\nOpening configuration editor...\n'));
    // Open config in editor
  }

  private async help(): Promise<void> {
    console.log(chalk.bold(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${chalk.cyan('Shopify Dev CLI')} - AI-Powered App Development        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `));
    
    console.log(chalk.bold('Commands:\n'));
    
    const commands = [
      { name: 'init [name]', desc: 'Initialize a new Shopify app' },
      { name: 'generate', desc: 'Generate code with AI (queries, webhooks, components)' },
      { name: 'gen', desc: 'Shortcut for generate' },
      { name: 'dev', desc: 'Start development server with tunnel' },
      { name: 'deploy', desc: 'Deploy app to Shopify' },
      { name: 'test', desc: 'Run tests' },
      { name: 'debug', desc: 'Debug webhooks and API calls' },
      { name: 'login', desc: 'Authenticate with Shopify' },
      { name: 'logout', desc: 'Clear authentication' },
      { name: 'whoami', desc: 'Show current login status' },
      { name: 'app', desc: 'Manage app configuration' },
    ];
    
    for (const cmd of commands) {
      console.log(`  ${chalk.cyan(cmd.name.padEnd(16))} ${cmd.desc}`);
    }
    
    console.log(chalk.bold('\nExamples:\n'));
    console.log(chalk.gray('  shopify init my-app'));
    console.log(chalk.gray('  shopify generate query "get all products with variants"'));
    console.log(chalk.gray('  shopify generate webhook "handle order creation"'));
    console.log(chalk.gray('  shopify dev --tunnel=localtunnel'));
    console.log('');
  }
}
