---
# You can also start simply with 'default'
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Abstract Syntax Tree (AST) & Typescript API
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply unocss classes to the current slide
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
layout: cover
---

# Abstract Syntax Tree (AST) & Typescript API

## How I learned to stop worrying and love the AST

Thibault Friedrich --- September 19th, 2024

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---

# Thibault Friedrich

- Frontend developer for 10 years
- Using _React_ for 6+ years and love it
- Strong focus on Ux, Agile and Code craftsmanship
  - how to create usable products
  - how to keep flexibility
  - how to write Clean Code
- Indie hacker, looking for designer to collaborate with
- Maintainer of [DesignSystemHub](https://design-system-hub.com), a solution to document your design system easier and faster than storybook

---

## What is an AST (Abstract Syntax Tree)?

When you try to analyze a language (programming or not):

<div class="text-center text-2xl">
"I love coding"
</div>

You have 2 steps:

- lexical analysis to detect the tokens: <kbd>I</kbd> <kbd>love</kbd> <kbd>coding</kbd>
- syntactic analysis to understand the relationship between tokens

```
sentence
  |- subject: I
  |- verb: love
  |- object: coding
```

⬆️ This is an AST

<div class="absolute left-60px bottom-20px text-xs">

[Useful article about what is an AST](https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38)

</div>

---

# Why do I need to know about AST?

Of course AST also exists to analyze source code.

Few useful use cases:

- custom eslint rules
- detect React components in the code
- it is used in all the compilers (Babel, TypeScript, etc.)

Generally: to **parse code**.

You don't want to recreate a parser yourself, you want to use an existing parser and you need to manipulate the result of this parser: an AST.

The goal of this presentation is to share with you what I learned. Just giving you enough keys to not be scared the next time you need an AST. 😱

➡️ Let's dive in a real example with TypeScript.

---

# [design-system-hub.com](https://design-system-hub.com)

![design system hub](/design-system-hub.png)

<div class="absolute bottom-30 right-30 text-white w-40 text-xl" v-click>Need to find the React components in the code</div>

<style>
img {
  border-radius: 10px;
  border: 1px solid #333;
}

</style>

---

# Typescript Compiler API

```ts
import ts from 'typescript'

const program = ts.createProgram(fileNames, tsConfig)
const checker = program.getTypeChecker()

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    visit(sourceFile) // <- do something with the AST
  }
}
```

➡️ Demo

<div class="absolute left-60px bottom-20px text-xs">

[Using the Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)

</div>

---
layout: image-right
image: /completion.png
backgroundSize: contain

---

# Conclusion

- Very light documentation
- try and retry
- use typescript to help you with the completion
- [AST Explorer](https://astexplorer.net/) is your friend but not always enough
- write unit tests to improve the coverage
- very powerful
- other very good example: [eslint custom rules](https://eslint.org/docs/latest/extend/custom-rules)

---
layout: two-cols
---

# Stay in contact


- [https://www.linkedin.com/in/thibault-friedrich/](https://www.linkedin.com/in/thibault-friedrich/)
- [https://github.com/friedrith](https://github.com/friedrith)
- [https://medium.com/@thibault-friedrich](https://medium.com/@thibault-friedrich)
- [thibault.friedrich@interaction-dynamics.io](mailto:thibault.friedrich@interaction-dynamics.io)
- [https://interaction-dynamics.io](https://interaction-dynamics.io)
- [https://design-system-hub.com](https://design-system-hub.com)


::right::

<div class="text-center flex flex-col items-center">

<img width="300" height="300" src="/qrcode.svg" alt="QrCode Repository">

[https://bit.ly/react-composition](https://bit.ly/react-composition)

</div>