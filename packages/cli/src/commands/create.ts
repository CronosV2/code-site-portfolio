import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

interface ProjectConfig {
  name: string;
  useTypeScript: boolean;
  template: 'minimal' | 'full';
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

export async function createProject(projectName: string) {
  console.log(chalk.cyan.bold('\n🌀 Bienvenue dans Vortex CLI!\n'));

  try {
    // Questions interactives
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useTypeScript',
        message: 'Utiliser TypeScript ?',
        default: true,
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choisir un template :',
        choices: [
          { name: 'Minimal (recommandé pour commencer)', value: 'minimal' },
          { name: 'Full (avec routing et exemples)', value: 'full' },
        ],
        default: 'minimal',
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Package manager :',
        choices: ['pnpm', 'npm', 'yarn'],
        default: 'pnpm',
      },
    ]);

    const config: ProjectConfig = {
      name: projectName,
      ...answers,
    };

    await scaffoldProject(config);
  } catch (error) {
    console.error(chalk.red('❌ Erreur lors de la création du projet:'), error);
    process.exit(1);
  }
}

async function scaffoldProject(config: ProjectConfig) {
  const projectPath = path.join(process.cwd(), config.name);

  // Vérifier si le dossier existe déjà
  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`❌ Le dossier "${config.name}" existe déjà!`));
    process.exit(1);
  }

  const spinner = ora('Création du projet...').start();

  try {
    // Créer le dossier du projet
    fs.mkdirSync(projectPath);

    // Copier le template
    const templatePath = path.join(__dirname, '../../..', 'templates', config.template);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template "${config.template}" introuvable`);
    }

    fs.copySync(templatePath, projectPath);

    // Créer le dossier .vortex pour les fichiers transpilés
    fs.mkdirSync(path.join(projectPath, '.vortex'), { recursive: true });

    // Mettre à jour package.json avec le nom du projet
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    packageJson.name = config.name;
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    spinner.succeed('Projet créé avec succès!');

    // Installer les dépendances
    const installSpinner = ora('Installation des dépendances...').start();
    
    try {
      process.chdir(projectPath);
      
      const installCmd = config.packageManager === 'yarn' 
        ? 'yarn install' 
        : `${config.packageManager} install`;
      
      execSync(installCmd, { stdio: 'ignore' });
      installSpinner.succeed('Dépendances installées!');
    } catch (error) {
      installSpinner.fail('Erreur lors de l\'installation des dépendances');
      console.log(chalk.yellow('\n⚠️  Vous pouvez les installer manuellement plus tard'));
    }

    // Instructions finales
    console.log(chalk.green.bold('\n✅ Projet Vortex créé avec succès!\n'));
    console.log(chalk.cyan('Pour commencer:'));
    console.log(chalk.white(`  cd ${config.name}`));
    console.log(chalk.white(`  ${config.packageManager} run dev`));
    console.log(chalk.cyan('\nCréez vos premiers fichiers .vtx dans src/app/!\n'));

  } catch (error) {
    spinner.fail('Erreur lors de la création du projet');
    throw error;
  }
}
