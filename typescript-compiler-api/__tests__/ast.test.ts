import { expect, test } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import ts from 'typescript'
import { findReactComponents } from '../src/ast'
import tsConfig from '../examples/all-use-cases/tsconfig.json'

const examples = [
  'no-component',
  'function',
  'default-exported-function',
  'arrow-function',
]

function getExpectedComponents(filename: string) {
  try {
    const component = JSON.parse(
      fs.readFileSync(filename.replace(/\.tsx$/, '.spec.json'), {
        encoding: 'utf8',
      })
    )
    return [
      {
        name: component.name,
        description: component.description,
        deprecated: component.deprecated ?? false,
        path: filename,
      },
    ]
  } catch {
    return []
  }
}

examples.forEach(example => {
  const dirname = path.join(__dirname, '../examples/all-use-cases', example)
  const filenames = fs
    .readdirSync(dirname)
    .filter(name => name.endsWith('.tsx'))

  filenames.forEach(filename => {
    const basename = path.basename(filename, '.tsx')
    const fullname = path.join(dirname, filename)

    test(`${example} / ${basename}`, () => {
      const expectedFullname = path.join(dirname, filename)

      const expectedComponents = getExpectedComponents(expectedFullname)

      const components = findReactComponents(
        [fullname],
        tsConfig as unknown as ts.CompilerOptions
      )

      expect(components).toEqual(expectedComponents)
    })
  })
})
