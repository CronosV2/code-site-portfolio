import chalk from 'chalk';
import { VortexTranspiler } from '@vortex/core';
import * as path from 'path';
import { spawn } from 'child_process';
import ora from 'ora';

export async function buildCommand() {
  console.log(chalk.cyan.bold('🌀 Build du projet Vortex...\n'));

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src', 'app');
  const vortexDir = path.join(projectRoot, '.vortex', 'app');

  // Transpiler tous les fichiers .vtx
  const spinner = ora('Transpilation des fichiers .vtx...').start();
  
  const transpiler = new VortexTranspiler({
    inputPath: srcDir,
    outputPath: vortexDir,
  });

  try {
    transpiler.transpileDirectory(srcDir, vortexDir);
    spinner.succeed('Fichiers .vtx transpilés');
  } catch (error) {
    spinner.fail('Erreur lors de la transpilation');
    console.error(error);
    process.exit(1);
  }

  // Build Next.js
  const buildSpinner = ora('Build Next.js...').start();

  const nextBuild = spawn('npx', ['next', 'build'], {
    stdio: 'inherit',
    shell: true,
  });

  nextBuild.on('close', (code) => {
    if (code === 0) {
      buildSpinner.succeed('Build terminé avec succès!');
      console.log(chalk.green.bold('\n✅ Projet prêt pour la production!\n'));
    } else {
      buildSpinner.fail('Erreur lors du build');
      process.exit(code || 1);
    }
  });
}
