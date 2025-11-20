import chokidar from 'chokidar';
import * as path from 'path';
import { VortexTranspiler } from './transpiler';

export interface WatcherOptions {
  inputDir: string;
  outputDir: string;
  onTranspile?: (file: string) => void;
}

export class VortexWatcher {
  private transpiler: VortexTranspiler;
  private watcher: chokidar.FSWatcher | null = null;

  constructor(private options: WatcherOptions) {
    this.transpiler = new VortexTranspiler({
      inputPath: options.inputDir,
      outputPath: options.outputDir,
    });
  }

  /**
   * Démarre le watcher pour surveiller les fichiers .vtx
   */
  start(): void {
    console.log(`🔍 Watching for .vtx files in: ${this.options.inputDir}`);

    this.watcher = chokidar.watch('**/*.vtx', {
      cwd: this.options.inputDir,
      ignored: /(^|[\/\\])\../, // Ignore les fichiers cachés
      persistent: true,
    });

    this.watcher
      .on('add', (file) => this.handleFileChange(file, 'added'))
      .on('change', (file) => this.handleFileChange(file, 'changed'))
      .on('unlink', (file) => this.handleFileDelete(file));

    console.log('✅ Vortex watcher started');
  }

  /**
   * Arrête le watcher
   */
  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      console.log('⏹ Vortex watcher stopped');
    }
  }

  /**
   * Gère les changements de fichiers
   */
  private handleFileChange(file: string, action: 'added' | 'changed'): void {
    console.log(`📝 File ${action}: ${file}`);

    const inputFile = path.join(this.options.inputDir, file);
    const outputFile = path.join(
      this.options.outputDir,
      file.replace(/\.vtx$/, '.tsx')
    );

    try {
      this.transpiler.transpileFile(inputFile, outputFile);
      console.log(`✅ Transpiled: ${file} -> ${outputFile}`);
      
      if (this.options.onTranspile) {
        this.options.onTranspile(file);
      }
    } catch (error) {
      console.error(`❌ Error transpiling ${file}:`, error);
    }
  }

  /**
   * Gère la suppression de fichiers
   */
  private handleFileDelete(file: string): void {
    console.log(`🗑 File deleted: ${file}`);
    // TODO: Supprimer le fichier .tsx correspondant
  }
}

export default VortexWatcher;
