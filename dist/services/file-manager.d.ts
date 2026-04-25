export declare class FileManager {
    /**
     * Read file contents
     */
    readFile(filePath: string): Promise<string | null>;
    /**
     * Write file contents
     */
    writeFile(filePath: string, content: string): Promise<void>;
    /**
     * Delete a file
     */
    deleteFile(filePath: string): Promise<void>;
    /**
     * Check if file exists
     */
    exists(filePath: string): Promise<boolean>;
    /**
     * Copy file or directory
     */
    copy(src: string, dest: string): Promise<void>;
    /**
     * Copy directory recursively
     */
    private copyDirectory;
    /**
     * List files in directory
     */
    listFiles(dir: string, options?: {
        recursive?: boolean;
        extensions?: string[];
    }): Promise<string[]>;
    /**
     * Create directory
     */
    mkdir(dirPath: string): Promise<void>;
    /**
     * Remove directory
     */
    rmdir(dirPath: string, options?: {
        recursive?: boolean;
    }): Promise<void>;
    /**
     * Hash file contents
     */
    hashFile(filePath: string): Promise<string>;
    /**
     * Get file stats
     */
    stat(filePath: string): Promise<{
        size: number;
        mtime: Date;
        ctime: Date;
        isFile: boolean;
        isDirectory: boolean;
    } | null>;
    /**
     * Watch file or directory for changes
     * Note: Returns a no-op cleanup function as fs.watch returns AsyncIterator in Node 20
     */
    watch(_dirPath: string, _callback: (event: string, filename: string) => void): () => void;
    /**
     * Execute command and capture output
     */
    execute(command: string, args: string[], options?: {
        cwd?: string;
    }): Promise<string>;
}
//# sourceMappingURL=file-manager.d.ts.map