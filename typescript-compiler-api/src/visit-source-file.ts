import ts from 'typescript'
import { isPascalCase } from './utils/isPascalCase'

export function visitSourceFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
) {
  const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile)
  const exports = checker.getExportsOfModule(sourceFileSymbol)

  return exports
    .flatMap(e => getReactComponentsFromExport(e, checker))
    .map(o => ({ ...o, path: sourceFile.fileName }))
}

function getReactComponentsFromExport(
  exportSymbol: ts.Symbol,
  checker: ts.TypeChecker
) {
  return exportSymbol.declarations
    .map(declaration => getReactComponent(declaration, checker))
    .filter(Boolean)
    .map(g => g as object)
}

function getReactComponent(
  declaration: ts.Declaration,
  checker: ts.TypeChecker
) {
  if (
    ts.isFunctionDeclaration(declaration) &&
    isPascalCase(declaration.name.getText())
  ) {
    return {
      name: declaration.name.getText(),
      description: ts.displayPartsToString(
        checker
          .getTypeAtLocation(declaration)
          .symbol?.getDocumentationComment(checker)
      ),
    }
  }

  if (
    ts.isVariableDeclaration(declaration) &&
    ts.isArrowFunction(declaration.initializer) &&
    isPascalCase(declaration.name.getText())
  ) {
    return {
      name: declaration.name?.getText(),
      description: ts.displayPartsToString(
        checker
          .getTypeAtLocation(declaration)
          .symbol?.getDocumentationComment(checker)
      ),
    }
  }

  return null
}
