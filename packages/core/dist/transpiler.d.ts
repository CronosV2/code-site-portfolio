export interface VortexTranspilerOptions {
    inputPath: string;
    outputPath: string;
}
export declare class VortexTranspiler {
    private options;
    constructor(options: VortexTranspilerOptions);
    /**
     * Transforme un fichier .vtx en .tsx
     */
    transpile(content: string): string;
    /**
     * Transpile un fichier depuis le système de fichiers
     */
    transpileFile(inputFile: string, outputFile: string): void;
    /**
     * Transpile tous les fichiers .vtx d'un dossier
     */
    transpileDirectory(inputDir: string, outputDir: string): void;
    /**
     * Récupère tous les fichiers .vtx d'un dossier récursivement
     */
    private getVtxFiles;
}
export default VortexTranspiler;
