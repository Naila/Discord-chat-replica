/*
 * Small microservice to generate a Discord-like chat section
 * Copyright (C) 2020 Bowser65
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import marked from 'marked'
import hljs from 'highlight.js'

class Markdown {
  constructor () {
    // Regexes
    this.urlRegex = /((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9-]+\.?)+[^\s<]*|^[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/ig
    this.imgRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:webp|jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/ig
    this.audioRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:mp3|ogg|wav|flac))(?:\?([^#]*))?(?:#(.*))?/ig
    this.videoRegex = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:mp4|webm|mov))(?:\?([^#]*))?(?:#(.*))?/ig

    this._initRenderer()
  }

  renderMarkdown (markdown, entities, extended = false) {
    marked.InlineLexer.rules.normal.link = extended ? this._link : /^$/
    this.renderer.paragraph = (str) => {
      str = this.renderer.__paragraph(str)
        .replace(/&lt;@([\d]+)&gt;/g, (raw, id) => {
          let mention = `<span class='mention' data-id='${id}'>`
          mention += (entities && entities.users && entities.users[id]) ? `@${entities.users[id].username}` : raw
          mention += '</span>'
          return mention
        }).replace(/&lt;#([\d]+)&gt;/g, (raw, id) => {
          let mention = '<span class="mention">'
          mention += (entities && entities.channels && entities.channels[id]) ? `#${entities.channels[id].name}` : raw
          mention += '</span>'
          return mention
        }).replace(/&lt;@&amp;([\d]+)&gt;/g, (raw, id) => {
          if (entities && entities.roles && entities.roles[id]) {
            const role = entities.roles[id]
            const style = role.color
              ? `--role-color: ${this.int2rgba(role.color)};--role-bg: ${this.int2rgba(role.color, 0.1)};--role-bg-h: ${this.int2rgba(role.color, 0.3)}`
              : ''
            return `<span class='mention role' style='${style}'>@${entities.roles[id].name}</span>`
          }
          return `<span class='mention'>${raw}</span>`
        })
      return str
    }

    const tokens = this.lexer.lex(markdown)
    return marked.parser(tokens, {
      renderer: this.renderer,
      langPrefix: 'hljs ',
      highlight: (code, lang) => {
        console.log('e', lang)
        if (!lang) return code
        try {
          return hljs.highlight(lang, code).value
        } catch (e) {
          console.warn(e)
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

    this.renderer.__paragraph = (str) => {
      str = str.replace(/__([^\s_])__(?!_)|__([^\s][\s\S]*?[^\s])__(?!_)/g, '<u>$2</u>')
        .replace(/&#95;/g, '_')
        .replace(/&lt;@!([\d]+)&gt;/g, '&lt;@$1&gt;')
        .replace(/&lt;(a?):([^:]+):(\d+)&gt;/g, (_, a, name, id) =>
          `<img class="emoji" src="https://cdn.discordapp.com/emojis/${id}.${a ? 'gif' : 'png'}" alt="${name}"/>`)
      return twemoji.parse(`<p>${str.replace('\n', '</p><p>')}</p>`, {
        callback: function (icon, options) {
          switch (icon) {
            case 'a9': // © copyright
            case 'ae': // ® registered trademark
            case '2122': // ™ trademark
              return false
            case '1f52b': // gun
              return 'https://canary.discordapp.com/assets/3071dbc60204c84ca0cf423b8b08a204.svg'
            case '1f440': // eyes
              return 'https://canary.discordapp.com/assets/ccf4c733929efd9762ab02cd65175377.svg'
          }
          return ''.concat(options.base, options.size, '/', icon, options.ext)
        }
      })
    }

    this.renderer.__link = this.renderer.link
    this.renderer.link = (href, title, text) => {
      return this.renderer.__link(href, title, text).replace(/_/g, '&#95;')
    }

    this.renderer.__code = this.renderer.code
    this.renderer.code = (code, infostring, escaped) => {
      const res = this.renderer.__code(code, infostring, escaped)
      const lang = infostring === '' ? '' : `<div class='lang'>${infostring}</div>`
      return res
        .replace('<pre>', `<pre class='codeblock'>${lang}<div class='shitcode'><div class='lines'></div>`)
        .replace('</pre>', '</div><div class="copy">Copy</div></pre>')
    }
  }

  int2rgba (int, a = 1) {
    return `rgba(${int >> 16 & 255}, ${int >> 8 & 255}, ${255 & int}, ${a})`
  }
}

module.exports = new Markdown()
