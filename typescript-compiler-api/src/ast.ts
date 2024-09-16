import ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'

const projectPath = path.join(__dirname, '../examples/example-1')

const file = (filename: string) => path.join(projectPath, filename)

const fileNames = fs
  .readdirSync(file('src'), { recursive: true })
  .map((file: string | Buffer) => file.toString())
  .map((file: string) => path.join(projectPath, 'src', file))

const tsConfig = JSON.parse(fs.readFileSync(file('tsconfig.json'), 'utf8'))

/**
 * Inspiration from https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker
 */
const program = ts.createProgram(fileNames, tsConfig)
const checker = program.getTypeChecker()

for (const sourceFile of program.getSourceFiles()) {
  console.log('step1: sourceFile', cleanFilename(sourceFile.fileName))

  if (!sourceFile.isDeclarationFile) {
    // console.log('step2: declared sourceFile', cleanFilename(sourceFile.fileName))
    // Walk the tree to search for classes
    visit(sourceFile)
  }
}

/** visit nodes finding exported classes */
function visit(sourceFile: ts.SourceFile) {
  const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile)
  const exports = checker.getExportsOfModule(sourceFileSymbol)

  const components = exports.flatMap(e =>
    getReactComponents(sourceFile.fileName, e)
  )

  // console.log(
  //   'step5: components',
  //   cleanFilename(sourceFile.fileName),
  //   components
  // )
}

function getReactComponents(filename: string, symbol: ts.Symbol) {
  return symbol.declarations.flatMap(declaration => {
    // console.log(
    //   'step3: declarations',
    //   cleanFilename(filename),
    //   declaration.getText()
    // )

    if (!ts.isFunctionDeclaration(declaration)) return [] // we accept only components that are functions

    const componentNameRegex = /^[A-Z]/ // starts with a capital letter

    if (!componentNameRegex.test(declaration.name.text)) return []

    // console.log(
    //   'step4: components',
    //   cleanFilename(filename),
    //   declaration.name.text
    // )

    return [
      {
        name: declaration.name.text,
      },
    ]
  })
}

function cleanFilename(filename: string) {
  return filename.replace(`${projectPath}/`, '')
}
