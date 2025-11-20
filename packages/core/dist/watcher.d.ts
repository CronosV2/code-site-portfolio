export interface WatcherOptions {
    inputDir: string;
    outputDir: string;
    onTranspile?: (file: string) => void;
}
export declare class VortexWatcher {
    private options;
    private transpiler;
    private watcher;
    constructor(options: WatcherOptions);
    /**
     * Démarre le watcher pour surveiller les fichiers .vtx
     */
    start(): void;
    /**
     * Arrête le watcher
     */
    stop(): void;
    /**
     * Gère les changements de fichiers
     */
    private handleFileChange;
    /**
     * Gère la suppression de fichiers
     */
    private handleFileDelete;
}
export default VortexWatcher;
