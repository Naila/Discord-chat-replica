const marked = require('marked')
const twemoji = require('twemoji')
const hljs = require('highlight.js')

// @todo: blacklist some twemojis (tm, c, r, eyes, gun)
// @todo: emoji, user, channel and role mentions
class Markdown {
  constructor () {
    // Regexes
    this.urlRegex = /((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9-]+\.?)+[^\s<]*|^[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/ig
    this.imgRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:webp|jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/ig
    this.audioRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:mp3|ogg|wav|flac))(?:\?([^#]*))?(?:#(.*))?/ig
    this.videoRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:mp4|webm|mov))(?:\?([^#]*))?(?:#(.*))?/ig

    this._initRenderer()
  }

  renderMarkdown (markdown, extended = false) {
    marked.InlineLexer.rules.normal.link = extended ? this._link : /^$/
    const tokens = this.lexer.lex(markdown)
    return marked.parser(tokens, {
      renderer: this.renderer,
      langPrefix: 'hljs ',
      highlight: (code, lang) => {
        if (!lang) return code
        try {
          return hljs.highlight(lang, code).value
        } catch (e) {
          return code
        }
      }
    })
  }

  _initRenderer () {
    this.lexer = new marked.Lexer()
    this.renderer = new marked.Renderer()

    this._link = marked.InlineLexer.rules.normal.link
    marked.InlineLexer.rules.normal = marked.InlineLexer.rules.gfm
    marked.InlineLexer.rules.normal.strong = /^\*\*([^\s*])\*\*(?!\*)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/
    this.lexer.rules.hr = this.lexer.rules.heading = this.lexer.rules.list = this.lexer.rules.table = /^$/
    this.lexer.rules.blockquote = /(?:^ {0,3}(?:(?:>>> ((.|\n)*))|(> (.*))))/
    this.renderer.blockquote = (str) => {
      return `<blockquote><div class='side'></div><div class='content'>${str.replace(/^<p>&gt;&gt; /, '<p>')}</div></blockquote>`
    }

    this.renderer.paragraph = (str) => {
      str = str.replace(/__([^\s_])__(?!_)|__([^\s][\s\S]*?[^\s])__(?!_)/g, '<u>$2</u>')
      return twemoji.parse(`<p>${str.replace('\n', '</p><p>')}</p>`)
    }

    this.renderer.__code = this.renderer.code
    this.renderer.code = (code, infostring, escaped) => {
      const res = this.renderer.__code(code, infostring, escaped)
      const lang = infostring === '' ? '' : `<div class='lang'>${infostring}</div>`
      return res
        .replace('<pre>', `<pre class="codeblock">${lang}<div class="shitcode"><div class="lines"></div>`)
        .replace('</pre>', '</div><div class="copy">Copy</div></pre>')
    }
  }
}

module.exports = new Markdown()
