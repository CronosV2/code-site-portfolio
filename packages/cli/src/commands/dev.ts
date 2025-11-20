import { VortexWatcher } from '@vortex/core';
import * as path from 'path';
import chalk from 'chalk';
import { spawn } from 'child_process';

export async function devCommand() {
  console.log(chalk.cyan.bold('🌀 Démarrage du serveur de développement Vortex...\n'));

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src', 'app');
  const vortexDir = path.join(projectRoot, '.vortex', 'app');

  // Démarrer le watcher Vortex
  const watcher = new VortexWatcher({
    inputDir: srcDir,
    outputDir: vortexDir,
    onTranspile: (file) => {
      console.log(chalk.green(`✅ ${file} transpilé`));
    },
  });

  // Transpiler tous les fichiers .vtx existants avant de démarrer
  console.log(chalk.yellow('📝 Transpilation initiale des fichiers .vtx...'));
  const { VortexTranspiler } = require('@vortex/core');
  const transpiler = new VortexTranspiler({
    inputPath: srcDir,
    outputPath: vortexDir,
  });

  try {
    transpiler.transpileDirectory(srcDir, vortexDir);
    console.log(chalk.green('✅ Transpilation initiale terminée\n'));
  } catch (error) {
    console.error(chalk.red('❌ Erreur lors de la transpilation initiale:'), error);
  }

  watcher.start();

  // Démarrer Next.js
  console.log(chalk.cyan('🚀 Démarrage de Next.js...\n'));
  
  const nextProcess = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n⏹ Arrêt du serveur...'));
    watcher.stop();
    nextProcess.kill();
    process.exit(0);
  });
}
