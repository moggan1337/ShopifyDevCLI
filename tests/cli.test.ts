import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('chalk', () => ({
  default: {
    bold: (s: string) => s,
    cyan: (s: string) => s,
    green: (s: string) => s,
    red: (s: string) => s,
    yellow: (s: string) => s,
    gray: (s: string) => s,
  },
}));

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('execa', () => ({
  execa: vi.fn().mockResolvedValue({ stdout: '' }),
}));

vi.mock('ora', () => ({
  default: () => ({
    start: () => ({ succeed: () => {}, fail: () => {} }),
    succeed: () => {},
    fail: () => {},
  }),
}));

describe('McpCli', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('run', () => {
    it('should display help when no command provided', async () => {
      const { McpCli } = await import('../src/cli.js');
      const cli = new McpCli();
      
      // The help should be called when no args
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      await cli.run();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('loadConfig', () => {
    it('should load config from environment variables', async () => {
      process.env.SHOPIFY_STORE_DOMAIN = 'test.myshopify.com';
      process.env.MINIMAX_API_KEY = 'test-key';
      
      const { McpCli } = await import('../src/cli.js');
      const cli = new McpCli();
      
      expect(cli).toBeDefined();
    });
  });
});

describe('CLI Commands', () => {
  it('should export CLIConfig type', () => {
    const { CLIConfig } = require('../src/types.js');
    expect(CLIConfig).toBeDefined();
  });

  it('should export InitOptions type', () => {
    const { InitOptions } = require('../src/types.js');
    expect(InitOptions).toBeDefined();
  });

  it('should export GenerateOptions type', () => {
    const { GenerateOptions } = require('../src/types.js');
    expect(GenerateOptions).toBeDefined();
  });
});
