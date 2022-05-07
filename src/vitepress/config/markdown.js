const path = require('path')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const mdContainer = require('markdown-it-container')
const docRoot = path.resolve(__dirname, '../../../demo')
const { highlight } = require('./highlight')

const localMd = MarkdownIt()

export const mdPlugin = (md) => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
            'utf-8'
          )
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)

        return `<Demo :demos="demos" source="${encodeURIComponent(
           highlight(source, 'vue')
        )}" path="${sourceFile}" description="${encodeURIComponent(localMd.render(description))}">`
      } else {
        return '</Demo>'
      }
    },
  })
}


const combineScriptSetup = (codes) => (
  `\n<script setup>
  ${codes.join('\n')}
  </script>
  `
)

export const MarkdownTransform = (demoRoot) => {
  return {
    name: 'element-plus-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return
      const componentId = path.basename(id, '.md')
      const pattern = path.join(demoRoot, `/${componentId}/*.vue`)
      const append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.globEager('${pattern}')`,
        ],
      }
      return code + `\n${combineScriptSetup(append.scriptSetups)}`
    },
  }
}
