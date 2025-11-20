"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const inquirer_1 = __importDefault(require("inquirer"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
async function createProject(projectName) {
    console.log(chalk_1.default.cyan.bold('\n🌀 Bienvenue dans Vortex CLI!\n'));
    try {
        // Questions interactives
        const answers = await inquirer_1.default.prompt([
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
        const config = {
            name: projectName,
            ...answers,
        };
        await scaffoldProject(config);
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Erreur lors de la création du projet:'), error);
        process.exit(1);
    }
}
async function scaffoldProject(config) {
    const projectPath = path.join(process.cwd(), config.name);
    // Vérifier si le dossier existe déjà
    if (fs.existsSync(projectPath)) {
        console.error(chalk_1.default.red(`❌ Le dossier "${config.name}" existe déjà!`));
        process.exit(1);
    }
    const spinner = (0, ora_1.default)('Création du projet...').start();
    try {
        // Créer le dossier du projet
        fs.mkdirSync(projectPath);
        // Copier le template
        // Toujours chercher dans le dossier templates à côté du code compilé (dist/templates)
        let templatePath = path.resolve(__dirname, '../templates', config.template);
        if (!fs.existsSync(templatePath)) {
            // fallback: si jamais le chemin ci-dessus ne marche pas, essayer un chemin absolu (dev/debug)
            templatePath = path.resolve(__dirname, '../../templates', config.template);
        }
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template "${config.template}" introuvable dans ${templatePath}`);
        }
        fs.copySync(templatePath, projectPath);
        // Créer le dossier .vortex pour les fichiers transpilés
        fs.mkdirSync(path.join(projectPath, '.vortex'), { recursive: true });
        // Mettre à jour package.json avec le nom du projet
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = fs.readJsonSync(packageJsonPath);
        packageJson.name = config.name;
        // Ajoute create-vortex-app en devDependency
        packageJson.devDependencies = packageJson.devDependencies || {};
        // Utilise la même version que le CLI courant
        const cliPkg = fs.readJsonSync(path.resolve(__dirname, '../../package.json'));
        packageJson.devDependencies['create-vortex-app'] = `^${cliPkg.version}`;
        fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
        spinner.succeed('Projet créé avec succès!');
        // Installer les dépendances
        const installSpinner = (0, ora_1.default)('Installation des dépendances...').start();
        try {
            process.chdir(projectPath);
            const installCmd = config.packageManager === 'yarn'
                ? 'yarn install'
                : `${config.packageManager} install`;
            (0, child_process_1.execSync)(installCmd, { stdio: 'ignore' });
            installSpinner.succeed('Dépendances installées!');
        }
        catch (error) {
            installSpinner.fail('Erreur lors de l\'installation des dépendances');
            console.log(chalk_1.default.yellow('\n⚠️  Vous pouvez les installer manuellement plus tard'));
        }
        // Instructions finales
        console.log(chalk_1.default.green.bold('\n✅ Projet Vortex créé avec succès!\n'));
        console.log(chalk_1.default.cyan('Pour commencer:'));
        console.log(chalk_1.default.white(`  cd ${config.name}`));
        console.log(chalk_1.default.white(`  ${config.packageManager} run dev`));
        console.log(chalk_1.default.cyan('\nCréez vos premiers fichiers .vtx dans src/app/!\n'));
    }
    catch (error) {
        spinner.fail('Erreur lors de la création du projet');
        throw error;
    }
}
