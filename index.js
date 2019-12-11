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
          staff: false
        },
        '6969': {
          avatar: 'https://weeb.services/assets/avatars/rtzoj7LMmW4.png',
          username: 'Noire',
          discriminator: '1337',
          staff: true
        }
      },
      messages: [
        { author: '1337', time: 1576091429571, content: [ "message 1", "message 2", "message *with* stupid **markdown**" ] },
        { author: '6969', time: 1576091466245, content: [ "yes", "__but actually__", "emma is ***cute***" ] }
      ]
    }

    // const rendered = ReactDOMServer.renderToStaticMarkup(React.createElement(Chat.default, JSON.parse(data)))
    const rendered = ReactDOMServer.renderToStaticMarkup(React.createElement(Chat.default, data))
    res.end(html.replace('{react}', rendered))
    // })
  }).listen(config.port)
