import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as fs from 'fs';
import * as path from 'path';

export interface VortexTranspilerOptions {
  inputPath: string;
  outputPath: string;
}

export class VortexTranspiler {
  constructor(private options: VortexTranspilerOptions) {}

  /**
   * Transforme un fichier .vtx en .tsx
   */
  transpile(content: string): string {
    try {
      // Parse le fichier avec support JSX
      const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      // Traverse l'AST pour détecter les balises Vortex
      traverse(ast as any, {
        JSXElement(path: any) {
          const openingElement = path.node.openingElement;
          
          // Détecter <route path="...">
          if (t.isJSXIdentifier(openingElement.name) && openingElement.name.name === 'route') {
            // Extraire le path
            const pathAttr = openingElement.attributes.find(
              (attr: any) =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === 'path'
            );
            
            // Remplacer par un composant React standard
            const newElement = t.jsxElement(
              t.jsxOpeningElement(t.jsxIdentifier('div'), []),
              t.jsxClosingElement(t.jsxIdentifier('div')),
              path.node.children as any,
              false
            );
            
            // Créer la fonction export default
            const functionDeclaration = t.exportDefaultDeclaration(
              t.functionDeclaration(
                t.identifier('Page'),
                [],
                t.blockStatement([
                  t.returnStatement(newElement)
                ])
              )
            );
            
            // Remplacer tout le programme par cette déclaration
            const programPath = path.findParent((p: any) => p.isProgram());
            if (programPath) {
              programPath.node.body = [functionDeclaration];
            }
            
            path.stop();
          }
        },
      });

      // Générer le code transformé
      const output = generate(ast as any, {
        retainLines: false,
        compact: false,
      });

      return output.code;
    } catch (error) {
      console.error('Erreur de transpilation:', error);
      throw error;
    }
  }

  /**
   * Transpile un fichier depuis le système de fichiers
   */
  transpileFile(inputFile: string, outputFile: string): void {
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
  transpileDirectory(inputDir: string, outputDir: string): void {
    const files = this.getVtxFiles(inputDir);
    
    files.forEach((file) => {
      const relativePath = path.relative(inputDir, file);
      const outputFile = path.join(
        outputDir,
        relativePath.replace(/\.vtx$/, '.tsx')
      );
      
      console.log(`Transpiling: ${relativePath}`);
      this.transpileFile(file, outputFile);
    });
  }

  /**
   * Récupère tous les fichiers .vtx d'un dossier récursivement
   */
  private getVtxFiles(dir: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(dir);
    
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getVtxFiles(fullPath));
      } else if (item.endsWith('.vtx')) {
        files.push(fullPath);
      }
    });
    
    return files;
  }
}

export default VortexTranspiler;
