/**
 * Small microservice to generate a Discord-like chat section
 * Copyright (C) 2019-present Bowser65
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

const { readFileSync } = require('fs')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const Chat = require('./dist/Chat')
const config = require('./config')
const html = readFileSync('index.html', 'utf8')

require('http')
  .createServer((req, res) => {
    /*
    if (req.method !== 'POST') {
      res.writeHead(404)
      res.end()
    } */
    // let data = ''
    // req.on('data', chunk => data += chunk)
    // req.on('end', () => {
    const data = {
      channel_name: 'emma-is-cute',
      users: {
        '1337': {
          avatar: 'https://weeb.services/assets/avatars/ZPhAsM9w3NA.png',
          username: 'Shana',
          discriminator: '6969',
          badge: null
        },
        '6969': {
          avatar: 'https://weeb.services/assets/avatars/rtzoj7LMmW4.png',
          username: 'Noire',
          discriminator: '1337',
          badge: 'Staff'
        }
      },
      messages: [
        {
          author: '1337',
          time: 1576091429571,
          content: [
            { msg: 'basic *formatting* using **markdown** because it\'s __important__ and it seems to be `working`' }
          ]
        },
        {
          author: '6969',
          time: 1576091466245,
          content: [
            { msg: '> it seems to be working\nthen don\'t touch anything' },
            { msg: '# life pro tips' },
            { msg: 'https://example.com' }
          ]
        },
        {
          author: '1337',
          time: 1576091429571,
          content: [
            { msg: '```js\nconsole.log("uwu")\n```' }
          ]
        },
        {
          author: '6969',
          time: 1576091466245,
          content: [
            { msg: '>>> that looks\ndope man' }
          ]
        },
        {
          author: '6969',
          time: 1576091466245,
          content: [
            { msg: 'https://media.karousell.com/media/photos/products/2018/11/09/754_tumblr_tropical_ulzzang_beach_wear_kimono_1541746668_9831ddd5_progressive.jpg' }
          ]
        },
        {
          author: '6969',
          time: 1576091466245,
          content: [
            {
              msg: 'test file',
              attachments: [
                {
                  url: 'https://example.com/test.zip',
                  size: 69691337
                }
              ]
            }
          ]
        },
        {
          author: '6969',
          time: 1576091466245,
          content: [
            {
              msg: 'test img',
              attachments: [
                {
                  url: 'https://epic.weeb.services/0afe075b36.png'
                }
              ]
            }
          ]
        }
      ]
    }

    // const rendered = ReactDOMServer.renderToStaticMarkup(React.createElement(Chat.default, JSON.parse(data)))
    const rendered = ReactDOMServer.renderToStaticMarkup(React.createElement(Chat.default, data))
    res.end(html.replace('{react}', rendered))
    // })
  }).listen(config.port)
