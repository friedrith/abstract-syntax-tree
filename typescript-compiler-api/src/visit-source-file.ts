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
  return exportSymbol.declarations.flatMap(declaration =>
    getReactComponents(declaration, checker)
  )
}

function getReactComponents(
  declaration: ts.Declaration,
  checker: ts.TypeChecker
) {
  if (!ts.isFunctionDeclaration(declaration)) return [] // we accept only components that are functions

  if (!isPascalCase(declaration.name.text)) return []

  return [
    {
      name: declaration.name.text,
      description: ts.displayPartsToString(
        checker
          .getTypeAtLocation(declaration)
          .symbol?.getDocumentationComment(checker)
      ),
      deprecated: ts
        .getJSDocTags(declaration)
        .some(tag => tag.tagName.text === 'deprecated'),
    },
  ]
}
