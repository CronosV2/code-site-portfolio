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
exports.VortexWatcher = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const path = __importStar(require("path"));
const transpiler_1 = require("./transpiler");
class VortexWatcher {
    constructor(options) {
        this.options = options;
        this.watcher = null;
        this.transpiler = new transpiler_1.VortexTranspiler({
            inputPath: options.inputDir,
            outputPath: options.outputDir,
        });
    }
    /**
     * Démarre le watcher pour surveiller les fichiers .vtx
     */
    start() {
        console.log(`🔍 Watching for .vtx files in: ${this.options.inputDir}`);
        this.watcher = chokidar_1.default.watch('**/*.vtx', {
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
    stop() {
        if (this.watcher) {
            this.watcher.close();
            console.log('⏹ Vortex watcher stopped');
        }
    }
    /**
     * Gère les changements de fichiers
     */
    handleFileChange(file, action) {
        console.log(`📝 File ${action}: ${file}`);
        const inputFile = path.join(this.options.inputDir, file);
        const outputFile = path.join(this.options.outputDir, file.replace(/\.vtx$/, '.tsx'));
        try {
            this.transpiler.transpileFile(inputFile, outputFile);
            console.log(`✅ Transpiled: ${file} -> ${outputFile}`);
            if (this.options.onTranspile) {
                this.options.onTranspile(file);
            }
        }
        catch (error) {
            console.error(`❌ Error transpiling ${file}:`, error);
        }
    }
    /**
     * Gère la suppression de fichiers
     */
    handleFileDelete(file) {
        console.log(`🗑 File deleted: ${file}`);
        // TODO: Supprimer le fichier .tsx correspondant
    }
}
exports.VortexWatcher = VortexWatcher;
exports.default = VortexWatcher;
