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

/* eslint-disable */
const url = require('url')
const twemoji = require('twemoji')
const hljs = require('highlight.js')
const SimpleMarkdown = require('simple-markdown')
// eslint-disable-next-line node/no-deprecated-api
const punycode = require('punycode') // this is from npm but eslint dumb

function depunycodeLink (target) {
  try {
    const urlObject = url.parse(target)
    urlObject.hostname = punycode.toASCII(urlObject.hostname || '')
    return url.format(urlObject)
  } catch (e) {
    return target
  }
}

function parseLink ([ , link ]) {
  const target = depunycodeLink(link)

  return {
    type: 'link',
    content: [
      {
        type: 'text',
        content: target,
      },
    ],
    target
  }
}

function int2rgba (int, a = 1) {
  return `rgba(${int >> 16 & 255}, ${int >> 8 & 255}, ${255 & int}, ${a})`
}

const defaultRules = {
  newline: SimpleMarkdown.defaultRules.newline,
  paragraph: SimpleMarkdown.defaultRules.paragraph,
  escape: SimpleMarkdown.defaultRules.escape,
  blockQuote: {
    ...SimpleMarkdown.defaultRules.blockQuote,
    match: (source, state) => {
      if (/^$|\n *$/.test(state.prevCapture || '') && !state.inQuote && !state.nested) {
        return /^( *>>> +([\s\S]*))|^( *>(?!>>) +[^\n]*(\n *>(?!>>) +[^\n]*)*\n?)/.exec(source)
      }
      return null
    },
    parse: ([ source ], parse, state) => {
      const multilineRegex = /^ *>>> ?/
      const simpleRegex = /^ *> ?/gm
      const isMultiline = multilineRegex.exec(source)
      const cleanString = source.replace(isMultiline ? multilineRegex : simpleRegex, '')

      const prevInQuote = !!state.inQuote
      const prenInline = !!state.inline
      state.inQuote = true
      if (!isMultiline) {
        state.inline = true
      }

      const formattedMarkup = parse(cleanString, state)
      state.inQuote = prevInQuote
      state.inline = prenInline
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
    }
  },
  link: {
    ...SimpleMarkdown.defaultRules.link,
    match: (source, state, prevCapture) => {
      if (!state.allowInlineLinks) {
        return null
      }
      return SimpleMarkdown.defaultRules.link.match(source, state, prevCapture)
    }
  },
  autolink: {
    ...SimpleMarkdown.defaultRules.autolink,
    parse: parseLink
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
    parse: parseLink
  },
  strong: SimpleMarkdown.defaultRules.strong,
  em: SimpleMarkdown.defaultRules.em,
  u: SimpleMarkdown.defaultRules.u,
  br: SimpleMarkdown.defaultRules.br,
  text: SimpleMarkdown.defaultRules.text,
  inlineCode: SimpleMarkdown.defaultRules.inlineCode,
  codeBlock: {
    order: SimpleMarkdown.defaultRules.codeBlock.order,
    match: e => /^```(([a-z0-9_+\-.]+?)\n)?\n*([^\n][^]*?)\n*```/i.exec(e),
    parse: ([ , , lang, content ], _, state) => ({
      lang: (lang || '').trim(),
      content: content || '',
      inQuote: !!state.inQuote
    }),
    html: (node) => SimpleMarkdown.htmlTag('pre', [
      node.lang && SimpleMarkdown.htmlTag('div', node.lang, { class: 'lang' }),
      SimpleMarkdown.htmlTag('div', [
        SimpleMarkdown.htmlTag('div', '', { class: 'lines' }),
        hljs.highlight(node.lang, node.content).value
      ].join(''), { class: 'shitcode' }),
      SimpleMarkdown.htmlTag('div', 'Copy', { class: 'copy' })
    ].filter(Boolean).join(''), { class: 'codeblock' })
  },
  roleMention: {
    order: SimpleMarkdown.defaultRules.text.order,
    match: e => /^<@&(\d+)>/.exec(e),
    parse: ([ , id ], _, state) => {
      const role = state.entities.roles[id]
      if (!role) {
        return {
          type: 'text',
          content: '@deleted-role'
        }
      }
      return {
        type: 'mention',
        color: role.color,
        content: [ {
          type: 'text',
          content: `@${role.name}`
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
          content: '#deleted-channel'
        }
      }
      return {
        type: 'mention',
        content: [ {
          type: 'text',
          content: `@${channel.name}`
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
          type: 'mention',
          user: state.entities.users[id],
          content: [ {
            type: 'text',
            content: `@${state.entities.users[id].username}`
          } ]
        }
      }

      return {
        type: 'mention',
        content: [ {
          type: 'text',
          content: raw
        } ]
      }
    },
    html: (node, output, state) => {
      const attributes = {
        class: 'mention'
      }
      if (node.user) {
        attributes.is = 'message-mention'
        for (const data in node.user) {
          // noinspection JSUnfilteredForInLoop
          attributes[`data-${data}`] = node.user[data] || ''
        }
      }
      if (node.color) {
        attributes.class += ' role'
        attributes.style = `--role-color:${int2rgba(node.color)};--role-bg:${int2rgba(node.color, 0.1)};--role-bg-h:${int2rgba(node.color, 0.3)}`
      }
      return SimpleMarkdown.htmlTag('span', output(node.content, state), attributes)
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
    html: (node, output, state) => SimpleMarkdown.htmlTag('span', output(node.content, state), {
      class: 'spoiler',
      is: 'message-spoiler'
    })
  }
}

const parser = SimpleMarkdown.parserFor(defaultRules)
const htmlOutput = SimpleMarkdown.htmlFor(SimpleMarkdown.ruleOutput(defaultRules, 'html'))
let tree = parser('```js\nconsole.log("memes");\n```\n**test** __owo__ ~~yeet~~ *OwO* ********owo?******** ||Shana doesn\'t die|| <@1337> <a:test:11111> @everyone https://weeb.services/ [test](https://pong.yes)\n > test\ntest\n\n**yeetus deletus**\n >>> test\ntest\ntest', {
  entities: {
    users: {
      1337: {
        'avatar': 'https://weeb.services/assets/avatars/ZPhAsM9w3NA.png',
        'username': 'Shana',
        'discriminator': '6969',
        'badge': null
      }
    }
  },
  inline: true
})
tree = require('./astutils').flattenAst(tree)
tree = require('./astutils').constrainAst(tree)
const html = htmlOutput(tree)
console.log(tree)
console.log(html)
