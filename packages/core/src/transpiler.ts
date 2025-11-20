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

      let hasRoute = false;
      const fetchStatements: any[] = [];
      const vortexComponents = new Set<string>();

      // Traverse l'AST pour détecter les balises Vortex
      traverse(ast as any, {
        JSXElement(path: any) {
          const openingElement = path.node.openingElement;
          const elementName = openingElement.name;
          
          // Détecter les composants Vortex (VButton, VCard, VInput)
          if (t.isJSXIdentifier(elementName) && elementName.name.startsWith('V')) {
            vortexComponents.add(elementName.name);
          }
        },
      });

      // Deuxième passage pour transformer les balises spéciales
      traverse(ast as any, {
        JSXElement(path: any) {
          const openingElement = path.node.openingElement;
          
          // Détecter <fetch server url="..." as="...">
          if (t.isJSXIdentifier(openingElement.name) && openingElement.name.name === 'fetch') {
            const urlAttr = openingElement.attributes.find(
              (attr: any) =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === 'url'
            );
            
            const asAttr = openingElement.attributes.find(
              (attr: any) =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === 'as'
            );

            const serverAttr = openingElement.attributes.find(
              (attr: any) =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === 'server'
            );

            if (urlAttr && asAttr && serverAttr) {
              const url = (urlAttr.value as any).value;
              const varName = (asAttr.value as any).value;
              
              // Créer le code de fetch
              // const data = await fetch('url').then(r => r.json())
              const fetchCode = t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(varName),
                  t.awaitExpression(
                    t.callExpression(
                      t.memberExpression(
                        t.callExpression(
                          t.identifier('fetch'),
                          [t.stringLiteral(url)]
                        ),
                        t.identifier('then')
                      ),
                      [
                        t.arrowFunctionExpression(
                          [t.identifier('r')],
                          t.callExpression(
                            t.memberExpression(t.identifier('r'), t.identifier('json')),
                            []
                          )
                        )
                      ]
                    )
                  )
                )
              ]);
              
              fetchStatements.push(fetchCode);
              
              // Remplacer <fetch> par son contenu
              const children = path.node.children;
              if (children.length > 0) {
                path.replaceWithMultiple(children);
              } else {
                path.remove();
              }
            }
          }
          
          // Détecter <route path="...">
          if (t.isJSXIdentifier(openingElement.name) && openingElement.name.name === 'route') {
            hasRoute = true;
            
            // Remplacer par un composant React standard
            const newElement = t.jsxElement(
              t.jsxOpeningElement(t.jsxIdentifier('div'), []),
              t.jsxClosingElement(t.jsxIdentifier('div')),
              path.node.children as any,
              false
            );
            
            // Créer la fonction export default async
            const functionBody = [
              ...fetchStatements,
              t.returnStatement(newElement)
            ];
            
            const functionDeclaration = t.exportDefaultDeclaration(
              t.functionDeclaration(
                t.identifier('Page'),
                [],
                t.blockStatement(functionBody),
                false,
                fetchStatements.length > 0 // async si y'a des fetch
              )
            );
            
            // Ajouter les imports des composants Vortex
            const imports: any[] = [];
            if (vortexComponents.size > 0) {
              const specifiers = Array.from(vortexComponents).map(name =>
                t.importSpecifier(t.identifier(name), t.identifier(name))
              );
              imports.push(
                t.importDeclaration(
                  specifiers,
                  t.stringLiteral('@vortex/components')
                )
              );
            }
            
            // Remplacer tout le programme par cette déclaration
            const programPath = path.findParent((p: any) => p.isProgram());
            if (programPath) {
              programPath.node.body = [...imports, functionDeclaration];
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
