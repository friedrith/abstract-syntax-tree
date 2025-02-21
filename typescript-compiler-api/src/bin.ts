import * as fs from 'fs'
import * as path from 'path'
import { findReactComponents } from './ast'

const projectPath = path.join(__dirname, process.argv[2])

const file = (filename: string) => path.join(projectPath, filename)

const fileNames = fs
  .readdirSync(file('src'), { recursive: true })
  .map((file: string | Buffer) => file.toString())
  .map((file: string) => path.join(projectPath, 'src', file))

const tsConfig = JSON.parse(fs.readFileSync(file('tsconfig.json'), 'utf8'))

const components = findReactComponents(fileNames, tsConfig).map(cleanFilename)

console.clear()
console.log('components', components)

function cleanFilename({ path, ...component }: { path: string }) {
  return {
    ...component,
    path: path.replace(projectPath, ''),
  }
}
