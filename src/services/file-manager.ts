import fs from 'fs/promises';
import path from 'path';
import { execa } from 'execa';
import crypto from 'crypto';

export class FileManager {
  /**
   * Read file contents
   */
  async readFile(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Write file contents
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Check if file exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Copy file or directory
   */
  async copy(src: string, dest: string): Promise<void> {
    const srcStat = await fs.stat(src);
    
    if (srcStat.isDirectory()) {
      await this.copyDirectory(src, dest);
    } else {
      const destDir = path.dirname(dest);
      await fs.mkdir(destDir, { recursive: true });
      await fs.copyFile(src, dest);
    }
  }

  /**
   * Copy directory recursively
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * List files in directory
   */
  async listFiles(dir: string, options?: { recursive?: boolean; extensions?: string[] }): Promise<string[]> {
    const files: string[] = [];

    async function walk(currentDir: string): Promise<void> {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (options?.recursive) {
            await walk(fullPath);
          }
        } else {
          if (options?.extensions) {
            const ext = path.extname(entry.name).toLowerCase();
            if (options.extensions.includes(ext)) {
              files.push(fullPath);
            }
          } else {
            files.push(fullPath);
          }
        }
      }
    }

    await walk(dir);
    return files;
  }

  /**
   * Create directory
   */
  async mkdir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * Remove directory
   */
  async rmdir(dirPath: string, options?: { recursive?: boolean }): Promise<void> {
    try {
      if (options?.recursive) {
        await fs.rm(dirPath, { recursive: true, force: true });
      } else {
        await fs.rmdir(dirPath);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Hash file contents
   */
  async hashFile(filePath: string): Promise<string> {
    const content = await this.readFile(filePath);
    if (content === null) {
      throw new Error(`File not found: ${filePath}`);
    }
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Get file stats
   */
  async stat(filePath: string): Promise<{
    size: number;
    mtime: Date;
    ctime: Date;
    isFile: boolean;
    isDirectory: boolean;
  } | null> {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        mtime: stats.mtime,
        ctime: stats.ctime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      };
    } catch {
      return null;
    }
  }

  /**
   * Watch file or directory for changes
   * Note: Returns a no-op cleanup function as fs.watch returns AsyncIterator in Node 20
   */
  watch(_dirPath: string, _callback: (event: string, filename: string) => void): () => void {
    // In Node 20, fs.watch returns AsyncIterator which doesn't have close method
    // This is a placeholder - actual implementation would need fs.FSWatcher
    return () => {};
  }

  /**
   * Execute command and capture output
   */
  async execute(command: string, args: string[], options?: { cwd?: string }): Promise<string> {
    try {
      const { stdout } = await execa(command, args, {
        cwd: options?.cwd,
        stdio: 'pipe',
      });
      return stdout;
    } catch (error) {
      throw new Error(`Command failed: ${command} ${args.join(' ')} - ${error}`);
    }
  }
}
