import ts from 'typescript'
import { visitSourceFile } from './visit-source-file'

/**
 * Inspiration from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker
 */

export function findComponents(
  fileNames: string[],
  tsConfig: ts.CompilerOptions
) {
  const program = ts.createProgram(fileNames, tsConfig)
  const checker = program.getTypeChecker()

  return program
    .getSourceFiles()
    .filter(sourceFile => !sourceFile.isDeclarationFile)
    .flatMap(sourceFile => visitSourceFile(sourceFile, checker))
}
