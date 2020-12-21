/*
 * Copyright (c) 2020 Cynthia K. Rey
 * Licensed under the Open Software License version 3.0
 */

const url = require('url')
const twemoji = require('twemoji')
const hljs = require('highlight.js')
const SimpleMarkdown = require('simple-markdown')
// eslint-disable-next-line node/no-deprecated-api
const punycode = require('punycode') // this is from npm but eslint dumb

class Markdown {
  constructor () {
    this.defaultRules = {
      newline: {
        ...SimpleMarkdown.defaultRules.newline,
        match: SimpleMarkdown.inlineRegex(/^\n/),
        html: () => '<br>'
      },
      paragraph: SimpleMarkdown.defaultRules.paragraph,
      escape: SimpleMarkdown.defaultRules.escape,
      blockQuote: {
        ...SimpleMarkdown.defaultRules.blockQuote,
        match: (source, state) => {
          if (!/^$|\n *$/.test(state.prevCapture ? state.prevCapture[0] : '') || state.inQuote || state.nested) {
            return null
          }
          return /^( *>>> +([\s\S]*))|^( *>(?!>>) +[^\n]*(\n *>(?!>>) +[^\n]*)*\n?)/.exec(source)
        },
        parse: ([ source ], parse, state) => {
          const multilineRegex = /^ *>>> ?/
          const simpleRegex = /^ *> ?/gm
          const isMultiline = multilineRegex.exec(source)
          const cleanString = source.replace(isMultiline ? multilineRegex : simpleRegex, '')

          const prevInQuote = !!state.inQuote
          state.inQuote = true

          const formattedMarkup = parse(cleanString, state)
          state.inQuote = prevInQuote
          if (formattedMarkup.length === 0) {
            formattedMarkup.push({
              type: 'text',
              content: ' '
            })
          }
          return {
            content: formattedMarkup,
            type: 'blockQuote'
          }
        },
        html: (node, output, state) => SimpleMarkdown.htmlTag('blockquote', [
          SimpleMarkdown.htmlTag('div', '', { class: 'side' }),
          SimpleMarkdown.htmlTag('div', output(node.content, state).replace(/\n/g, '<br>'), { class: 'content' })
        ].join(''))
      },
      link: {
        ...SimpleMarkdown.defaultRules.link,
        match: (source, state, prevCapture) => {
          if (!state.allowInlineLinks) {
            return null
          }
          return SimpleMarkdown.defaultRules.link.match(source, state, prevCapture)
        },
        html: (node, output, state) => SimpleMarkdown.htmlTag('a', output(node.content, state), {
          href: SimpleMarkdown.sanitizeUrl(node.target),
          title: node.title,
          target: '_blank'
        })
      },
      autolink: {
        ...SimpleMarkdown.defaultRules.autolink,
        parse: this._parseLink.bind(this)
      },
      url: {
        ...SimpleMarkdown.defaultRules.url,
        match: (source, state) => {
          if (!state.inline) return null
          const match = /^((?:https?|steam):\/\/[^\s<]+[^<.,:;"'\]\s])/.exec(source)
          if (match !== null) {
            let prevIndex = 0
            let fixedMatch = match[0]
            for (let i = fixedMatch.length - 1; i >= 0; i--) {
              if (fixedMatch[i] !== ')') break
              const index = fixedMatch.indexOf('(', prevIndex)
              if (index === -1) {
                fixedMatch = fixedMatch.slice(0, fixedMatch.length - 1)
                break
              }
              prevIndex = index + 1
            }
            match[0] = match[1] = fixedMatch
          }
          return match
        },
        parse: this._parseLink.bind(this)
      },
      strong: SimpleMarkdown.defaultRules.strong,
      em: SimpleMarkdown.defaultRules.em,
      u: SimpleMarkdown.defaultRules.u,
      text: {
        ...SimpleMarkdown.defaultRules.text,
        html: node => {
          const res = SimpleMarkdown.sanitizeText(node.content).replace(/(^ +)|( +$)/g, '&nbsp;').replace(/\n/g, '<br>')
          return node.skipEmoji ? res : this.twemoji(res)
        }
      },
      inlineCode: SimpleMarkdown.defaultRules.inlineCode,
      codeBlock: {
        order: SimpleMarkdown.defaultRules.codeBlock.order,
        match: e => /^```(([a-z0-9_+\-.]+?)\n)?\n*([^\n][^]*?)\n*```/i.exec(e),
        parse: ([ , , lang, content ], _, state) => ({
          lang: (lang || '').trim(),
          content: content || '',
          inQuote: !!state.inQuote
        }),
        html: (node, output, state) => {
          let code, lang
          if (node.lang) {
            try {
              const res = hljs.highlight(node.lang, node.content)
              code = res.value
              lang = res.language
            } catch (e) {}
          }
          if (!code) {
            code = output({
              type: 'text',
              content: node.content
            }, state)
          }
          return SimpleMarkdown.htmlTag('pre', [
            lang && SimpleMarkdown.htmlTag('div', node.lang, { class: 'lang' }),
            SimpleMarkdown.htmlTag('div', [
              SimpleMarkdown.htmlTag('div', '', { class: 'lines' }),
              SimpleMarkdown.htmlTag('code', code, { class: [ 'hljs', lang ].filter(Boolean).join(' ') })
            ].join(''), { class: 'shitcode' }),
            SimpleMarkdown.htmlTag('div', 'Copy', { class: 'copy' })
          ].filter(Boolean).join(''), {
            class: 'codeblock',
            is: 'message-codeblock'
          })
        }
      },
      roleMention: {
        order: SimpleMarkdown.defaultRules.text.order,
        match: e => /^<@&(\d+)>/.exec(e),
        parse: ([ , id ], _, state) => {
          const role = state.entities.roles[id]
          if (!role) {
            return {
              type: 'text',
              content: `${state.noMentionPrefix ? '' : '@'}deleted-role`,
              skipEmoji: true
            }
          }
          return {
            id,
            type: 'mention',
            color: role.color,
            content: [ {
              type: 'text',
              content: `${state.noMentionPrefix ? '' : '@'}${role.name}`
            } ]
          }
        }
      },
      channel: {
        order: SimpleMarkdown.defaultRules.text.order,
        match: source => /^<#(\d+)>/.exec(source),
        parse: ([ , id ], _, state) => {
          const channel = state.entities.channels[id]
          if (!channel) {
            return {
              type: 'text',
              content: `${state.noMentionPrefix ? '' : '#'}deleted-channel`,
              skipEmoji: true
            }
          }
          return {
            id,
            type: 'mention',
            content: [ {
              type: 'text',
              content: `${state.noMentionPrefix ? '' : '#'}${channel.name}`
            } ]
          }
        }
      },
      mention: {
        order: SimpleMarkdown.defaultRules.text.order,
        match: e => /^<@!?(\d+)>|^(@(?:everyone|here))/.exec(e),
        parse: ([ raw, id ], _, state) => {
          if (id && state.entities.users[id]) {
            return {
              id,
              type: 'mention',
              user: state.entities.users[id],
              content: [
                {
                  type: 'text',
                  content: `${state.noMentionPrefix ? '' : '@'}${state.entities.users[id].username}`,
                  skipEmoji: true
                }
              ]
            }
          }

          return {
            id,
            type: 'mention',
            content: [
              {
                type: 'text',
                content: raw,
                skipEmoji: true
              }
            ]
          }
        },
        html: (node, output, state) => {
          const attributes = {
            'data-type': 'channel',
            'data-id': node.id
          }
          if (node.user) {
            attributes['data-type'] = 'user'
            for (const data in node.user) {
              // noinspection JSUnfilteredForInLoop
              attributes[`data-${data}`] = node.user[data] || ''
            }
          }
          if (node.color) {
            attributes['data-type'] = 'role'
            attributes.style = `--role-color:${this.int2rgba(node.color)};--role-bg:${this.int2rgba(node.color, 0.1)};--role-bg-h:${this.int2rgba(node.color, 0.3)}`
          }
          return SimpleMarkdown.htmlTag('message-mention', output(node.content, state), attributes)
        }
      },
      customEmoji: {
        order: SimpleMarkdown.defaultRules.text.order,
        match: e => /^<(a?):(\w+):(\d+)>/.exec(e),
        parse: ([ , animated, name, id ]) => ({
          type: 'customEmoji',
          id,
          name,
          animated: animated === 'a'
        }),
        html: ({ id, name, animated }) => SimpleMarkdown.htmlTag('img', null, {
          class: 'emoji',
          src: `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`,
          alt: `:${name}:`,
          is: 'message-emoji'
        }, false)
      },
      s: {
        order: SimpleMarkdown.defaultRules.u.order,
        match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
        parse: SimpleMarkdown.defaultRules.u.parse,
        html: (node, output, state) => SimpleMarkdown.htmlTag('s', output(node.content, state))
      },
      spoiler: {
        order: SimpleMarkdown.defaultRules.text.order,
        match: e => /^\|\|([\s\S]+?)\|\|/.exec(e),
        parse: ([ , content ], parse, state) => ({ content: parse(content, state) }),
        html: (node, output, state) => SimpleMarkdown.htmlTag('span',
          SimpleMarkdown.htmlTag('span', output(node.content, state)), {
            class: 'spoiler',
            is: 'message-spoiler'
          })
      }
    }
    this.limitReached = Symbol('ast.limit')
  }

  parse (markdown, entities, allowInlineLinks, noMentionPrefix) {
    if (!markdown) return ''
    const parser = SimpleMarkdown.parserFor(this.defaultRules)
    const htmlOutput = SimpleMarkdown.htmlFor(SimpleMarkdown.ruleOutput(this.defaultRules, 'html'))
    let tree = parser(markdown, {
      entities,
      allowInlineLinks,
      noMentionPrefix,
      inline: true
    })
    tree = this._flattenAst(tree)
    tree = this._constrainAst(tree)
    return htmlOutput(tree)
  }

  twemoji (raw) {
    return twemoji.parse(raw, {
      callback: function (icon, options) {
        switch (icon) {
          case 'a9': // © copyright
          case 'ae': // ® registered trademark
          case '2122': // ™ trademark
            return false
          case '1f52b': // gun
            return 'https://discord.com/assets/3071dbc60204c84ca0cf423b8b08a204.svg'
          case '1f440': // eyes
            return 'https://discord.com/assets/ccf4c733929efd9762ab02cd65175377.svg'
        }
        return ''.concat(options.base, options.size, '/', icon, options.ext)
      }
    })
  }

  int2rgba (int, a = 1) {
    return `rgba(${int >> 16 & 255}, ${int >> 8 & 255}, ${255 & int}, ${a})`
  }

  _flattenAst (ast, parentAst = null) {
    // Walk the AST.
    if (Array.isArray(ast)) {
      const astLength = ast.length
      for (let i = 0; i < astLength; i++) {
        ast[i] = this._flattenAst(ast[i], parentAst)
      }
      return ast
    }

    // And more walking...
    if (ast.content != null) {
      ast.content = this._flattenAst(ast.content, ast)
    }

    // Flatten the AST if the parent is the same as the current node type, we can just consume the content.
    if (parentAst != null && ast.type === parentAst.type) {
      return ast.content
    }

    return ast
  }

  _constrainAst (ast, state = { limit: 200 }) {
    if (ast.type !== 'text') {
      state.limit -= 1
      if (state.limit <= 0) {
        return this.limitReached
      }
    }

    if (Array.isArray(ast)) {
      const astLength = ast.length
      for (let i = 0; i < astLength; i++) {
        const newNode = this._constrainAst(ast[i], state)
        if (newNode === this.limitReached) {
          ast.length = i
          break
        }
        ast[i] = newNode
      }
    }

    return ast
  }

  _parseLink ([ , link ]) {
    const target = this._depunycodeLink(link)

    return {
      type: 'link',
      content: [
        {
          type: 'text',
          content: target
        }
      ],
      target
    }
  }

  _depunycodeLink (target) {
    try {
      const urlObject = new URL(target)
      urlObject.hostname = punycode.toASCII(urlObject.hostname || '')
      return url.format(urlObject)
    } catch (e) {
      return target
    }
  }
}

module.exports = new Markdown()
