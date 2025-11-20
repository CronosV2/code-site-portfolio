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
exports.VortexTranspiler = void 0;
const parser = __importStar(require("@babel/parser"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const t = __importStar(require("@babel/types"));
const generator_1 = __importDefault(require("@babel/generator"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class VortexTranspiler {
    constructor(options) {
        this.options = options;
    }
    /**
     * Transforme un fichier .vtx en .tsx
     */
    transpile(content) {
        try {
            // Parse le fichier avec support JSX
            const ast = parser.parse(content, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
            });
            let hasRoute = false;
            const fetchStatements = [];
            const vortexComponents = new Set();
            // Traverse l'AST pour détecter les balises Vortex
            (0, traverse_1.default)(ast, {
                JSXElement(path) {
                    const openingElement = path.node.openingElement;
                    const elementName = openingElement.name;
                    // Détecter les composants Vortex (VButton, VCard, VInput)
                    if (t.isJSXIdentifier(elementName) && elementName.name.startsWith('V')) {
                        vortexComponents.add(elementName.name);
                    }
                },
            });
            // Deuxième passage pour transformer les balises spéciales
            (0, traverse_1.default)(ast, {
                JSXElement(path) {
                    const openingElement = path.node.openingElement;
                    // Détecter <fetch server url="..." as="...">
                    if (t.isJSXIdentifier(openingElement.name) && openingElement.name.name === 'fetch') {
                        const urlAttr = openingElement.attributes.find((attr) => t.isJSXAttribute(attr) &&
                            t.isJSXIdentifier(attr.name) &&
                            attr.name.name === 'url');
                        const asAttr = openingElement.attributes.find((attr) => t.isJSXAttribute(attr) &&
                            t.isJSXIdentifier(attr.name) &&
                            attr.name.name === 'as');
                        const serverAttr = openingElement.attributes.find((attr) => t.isJSXAttribute(attr) &&
                            t.isJSXIdentifier(attr.name) &&
                            attr.name.name === 'server');
                        if (urlAttr && asAttr && serverAttr) {
                            const url = urlAttr.value.value;
                            const varName = asAttr.value.value;
                            // Créer le code de fetch
                            // const data = await fetch('url').then(r => r.json())
                            const fetchCode = t.variableDeclaration('const', [
                                t.variableDeclarator(t.identifier(varName), t.awaitExpression(t.callExpression(t.memberExpression(t.callExpression(t.identifier('fetch'), [t.stringLiteral(url)]), t.identifier('then')), [
                                    t.arrowFunctionExpression([t.identifier('r')], t.callExpression(t.memberExpression(t.identifier('r'), t.identifier('json')), []))
                                ])))
                            ]);
                            fetchStatements.push(fetchCode);
                            // Remplacer <fetch> par son contenu
                            const children = path.node.children;
                            if (children.length > 0) {
                                path.replaceWithMultiple(children);
                            }
                            else {
                                path.remove();
                            }
                        }
                    }
                    // Détecter <route path="...">
                    if (t.isJSXIdentifier(openingElement.name) && openingElement.name.name === 'route') {
                        hasRoute = true;
                        // Remplacer par un composant React standard
                        const newElement = t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('div'), []), t.jsxClosingElement(t.jsxIdentifier('div')), path.node.children, false);
                        // Créer la fonction export default async
                        const functionBody = [
                            ...fetchStatements,
                            t.returnStatement(newElement)
                        ];
                        const functionDeclaration = t.exportDefaultDeclaration(t.functionDeclaration(t.identifier('Page'), [], t.blockStatement(functionBody), false, fetchStatements.length > 0 // async si y'a des fetch
                        ));
                        // Ajouter les imports des composants Vortex
                        const imports = [];
                        if (vortexComponents.size > 0) {
                            const specifiers = Array.from(vortexComponents).map(name => t.importSpecifier(t.identifier(name), t.identifier(name)));
                            imports.push(t.importDeclaration(specifiers, t.stringLiteral('@vortex/components')));
                        }
                        // Remplacer tout le programme par cette déclaration
                        const programPath = path.findParent((p) => p.isProgram());
                        if (programPath) {
                            programPath.node.body = [...imports, functionDeclaration];
                        }
                        path.stop();
                    }
                },
            });
            // Générer le code transformé
            const output = (0, generator_1.default)(ast, {
                retainLines: false,
                compact: false,
            });
            return output.code;
        }
        catch (error) {
            console.error('Erreur de transpilation:', error);
            throw error;
        }
    }
    /**
     * Transpile un fichier depuis le système de fichiers
     */
    transpileFile(inputFile, outputFile) {
        const content = fs.readFileSync(inputFile, 'utf-8');
        const transformed = this.transpile(content);
        // Créer le dossier de sortie si nécessaire
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(outputFile, transformed, 'utf-8');
    }
    /**
     * Transpile tous les fichiers .vtx d'un dossier
     */
    transpileDirectory(inputDir, outputDir) {
        const files = this.getVtxFiles(inputDir);
        files.forEach((file) => {
            const relativePath = path.relative(inputDir, file);
            const outputFile = path.join(outputDir, relativePath.replace(/\.vtx$/, '.tsx'));
            console.log(`Transpiling: ${relativePath}`);
            this.transpileFile(file, outputFile);
        });
    }
    /**
     * Récupère tous les fichiers .vtx d'un dossier récursivement
     */
    getVtxFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                files.push(...this.getVtxFiles(fullPath));
            }
            else if (item.endsWith('.vtx')) {
                files.push(fullPath);
            }
        });
        return files;
    }
}
exports.VortexTranspiler = VortexTranspiler;
exports.default = VortexTranspiler;
