const { parse } = require('node-html-parser')
  
module.exports = function (content) {
    const target = this.target === 'web' ? 'web' : 'native'
    const notTarget = this.target === 'web' ? 'native' : 'web'
    if (this.loaders[this.loaderIndex].options === 'vue') {
      const doc = parse(content, {
        script: true,
        style: true
      })
      const parts = doc.childNodes.filter(
        ({
          rawAttrs
        }) => !rawAttrs || !rawAttrs.includes(notTarget)
      )
      return parts.map(el => el.outerHTML).join(' ')
    } else {
      return content
        .replace(
          new RegExp(
            `\/\\*--@${notTarget}--\\*\/[\\s\\S]*?\/\\*--@${notTarget}--\\*\/`,
            'g'
          ),
          ''
        )
        .replace(
          new RegExp(
            `\/\\*--@${target}--\\*\/([\\s\\S]*?)\/\\*--@${target}--\\*\/`,
            'g'
          ),
          '$1'
        )
    }
}