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
exports.devCommand = devCommand;
const vortex_core_1 = require("vortex-core");
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
async function devCommand() {
    console.log(chalk_1.default.cyan.bold('🌀 Démarrage du serveur de développement Vortex...\n'));
    const projectRoot = process.cwd();
    const srcDir = path.join(projectRoot, 'src', 'app');
    const vortexDir = path.join(projectRoot, '.vortex', 'app');
    // Démarrer le watcher Vortex
    const watcher = new vortex_core_1.VortexWatcher({
        inputDir: srcDir,
        outputDir: vortexDir,
        onTranspile: (file) => {
            console.log(chalk_1.default.green(`✅ ${file} transpilé`));
        },
    });
    // Transpiler tous les fichiers .vtx existants avant de démarrer
    console.log(chalk_1.default.yellow('📝 Transpilation initiale des fichiers .vtx...'));
    const { VortexTranspiler } = require('vortex-core');
    const transpiler = new VortexTranspiler({
        inputPath: srcDir,
        outputPath: vortexDir,
    });
    try {
        transpiler.transpileDirectory(srcDir, vortexDir);
        console.log(chalk_1.default.green('✅ Transpilation initiale terminée\n'));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Erreur lors de la transpilation initiale:'), error);
    }
    watcher.start();
    // Démarrer Next.js
    console.log(chalk_1.default.cyan('🚀 Démarrage de Next.js...\n'));
    const nextProcess = (0, child_process_1.spawn)('npx', ['next', 'dev'], {
        stdio: 'inherit',
        shell: true,
    });
    // Gestion de l'arrêt propre
    process.on('SIGINT', () => {
        console.log(chalk_1.default.yellow('\n\n⏹ Arrêt du serveur...'));
        watcher.stop();
        nextProcess.kill();
        process.exit(0);
    });
}
