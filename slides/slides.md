---
# You can also start simply with 'default'
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: /background.png
# some information about your slides (markdown enabled)
title: Abstract Syntax Tree (AST) & Typescript Compiler API
info: |
  If you want to write custom eslint rules, babel plugins, or other code parsers, you need to use Abstract Syntax Trees (AST). But they are generally scary for developers due to their complexity. In this talk, we will go through a real situation to parse some typescript React code using an AST and the Typescript Compiler API.
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
layout: cover
image: /completion.png
backgroundSize: contain

# https://confoo.ca/en/2025/feedback/AABB2D7FC079843F2B4CD62C4898BA8A
# https://qrgenerator.org/transparent-qr/
---

<div class="-mt-20">

# Abstract Syntax Tree (AST) <br/> & Typescript API

## How I learned to stop worrying and love the AST

Thibault Friedrich --- February 26th, 2025

</div>

<div class="absolute right-20 bottom-20 text-center" v-mark="{ at: 1, color: 'orange', type: 'circle' }">
<img src="/qrcode-form-6.svg" class="w-30" />
Feedback form
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

<style>

h1 {
  color: white;
}

h2 {
  color: #01a2ff;
  margin-top: 10px;
  font-weight: 500;
}
</style>

<!--
Today we will walk throught a real situation as a developer. This is not a theoretical talk but a practical one. We will see how to parse some typescript React code using an AST and the Typescript Compiler API. But I think the practice can be applied to other AST parsers. And I hope you will learn to love ASTs too.
-->

---
layout: image-right
image: /portrait.png
backgroundSize: cover

---

# About me: Thibault Friedrich

- Frontend developer for 10 years
- Using _React_ for 6+ years and love it
- Strong focus on Ux, Agile and Code craftsmanship  
  - ➡️ find my articles on [Medium](https://medium.com/@thibault-friedrich)
- Maintainer of [DesignSystemHub](https://design-system-hub.com)
  - Documentation for design systems
  - Storybook alternative
  - zero config
  - <span v-mark.highlight.orange>automatic detection</span> of React components

---

# Use case: [design-system-hub.com](https://design-system-hub.com)

![design system hub](/design-system-hub-2.png)

<div class="absolute top-30 left-15 text-white h-40 w-30" v-mark="{ at: 1, color: 'orange', type: 'circle' }"></div>


<div class="absolute top-40 left-60 text-white h-30 w-50" v-mark="{ at: 2, color: 'orange', type: 'circle' }"></div>

<div class="absolute bottom-15 right-75 text-white h-40 w-110" v-mark="{ at: 3, color: 'orange', type: 'circle' }"></div>


<div class="absolute bottom-40 right-18 text-orange w-50 text-xl" >
  
  <div v-click="'1'">Need to find:</div>
  <ul>
      <li v-click>React components</li>
      <li v-click>JsDoc</li>
      <li v-click>Properties</li>
  </ul>
</div>

<style>
img {
  border-radius: 10px;
  border: 1px solid #333;
}
</style>

---

# How to detect a React component in the code?

```tsx
type Props = {
  children: React.ReactNode
  variant: 'primary' | 'black' | 'basic'
  onClick: () => void | Promise<void>
}

/**
 * @deprecated
 */
const ButtonLegacy = ({ children, variant, onClick }: Props) => {
  return <button onClick={onClick} className={style[variant]}>{children}</button>
}
```

<div v-click class="mt-10">


  __Long online search: the AST seems to be the solution__ 
</div>
<div v-click>
  That's the moment you start to be scared and you think this project is too complex for you. 🤯😬
</div>


---

# What is an AST (Abstract Syntax Tree)?

<div v-click>

When you analyze a language like Javascript or English: 


<div class="text-center text-2xl">
"I love coding"
</div>

</div>




<div v-click>

1. __lexical__ analysis to detect the tokens: <kbd>I</kbd> <kbd>love</kbd> <kbd>coding</kbd>

</div>

<div v-click>

2. __syntactic__ analysis to understand the relationship between tokens

</div>



<div class="flex flex-row items-center justify-center">


<div v-click>

<div v-mark="{ at: 5, type: 'circle', color: 'orange' }">

```mermaid {theme: 'neutral', scale: 0.6}
graph TD
B[I love Coding] -->|Subject| C[I]
B[I love Coding] -->|Verb| D[love]
B[I love Coding] -->|Object| E[coding]
```

</div>

</div>

<div v-click>

<div class="flex flex-row items-center justify-center">
⬅️

<div class="flex flex-col items-center justify-center">
<strong class="pr-10">This is an AST (Abstract Syntax Tree) </strong>

<img src="/boom.gif" class="w-50" />
</div>
</div>



</div>





</div>






<div class="absolute left-60px bottom-20px text-xs">

[Abstract Syntax Tree (AST) - Explained in Plain English](https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38)

</div>

---

# Why do I need to know about AST?

Sometimes, you need to parse the source code:

- custom eslint rules
- babel plugins, typescript, etc
- detect React components in the code

__You don't want to recreate a parser yourself.__ <span v-click>➡️ Use a parser and its __AST.__ </span>

<div v-click>

[AST Explorer](https://astexplorer.net/) is a great tool to understand the AST of a language.

</div>

---

# Real example: [design-system-hub.com](https://design-system-hub.com)

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


<div class="absolute left-60px bottom-20px text-xs">

[Using the Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)

</div>

---
layout: center
---

# Demo time


---
layout: image-right
image: /completion.png
backgroundSize: contain

---

# Conclusion

- very powerful
- very light [documentation](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
- try and retry
- use typescript for Intellisense
- write unit tests to improve the coverage and avoid regressions
- [AST Explorer](https://astexplorer.net/) is your friend but not always enough
- other example: [eslint custom rules](https://eslint.org/docs/latest/extend/custom-rules)

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

[Repository](https://github.com/friedrith/abstract-syntax-tree)

</div>
