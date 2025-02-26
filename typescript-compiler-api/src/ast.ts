import ts from 'typescript'
import { visitSourceFile } from './visit-source-file'
import path from 'path'

/**
 * Inspiration from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker
 */

export function findReactComponents(
  fileNames: string[],
  tsConfig: ts.CompilerOptions
) {
  const program = ts.createProgram(fileNames, tsConfig)
  const checker = program.getTypeChecker()

  return program
    .getSourceFiles()
    .map(sourceFile => ({ path: sourceFile.fileName }))
}
