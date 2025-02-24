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
  return {}
}
