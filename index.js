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
const https = require('https')
const React = require('react')
const ReactDOMServer = require('react-dom/server')

const Chat = require('./dist/Chat').default
const testData = require('./example')
const config = require('./config')

const html = readFileSync('src/index.html', 'utf8')
  .replace('/* style */', readFileSync('dist/style.css', 'utf8'))
  .replace('/* script */', readFileSync('dist/script.js', 'utf8'))

require('http')
  .createServer((req, res) => {
    if (![ 'GET', 'POST' ].includes(req.method)) {
      res.writeHead(404)
      res.end()
    }

    const sizeFetcher = (url) => new Promise(resolve => {
      const parts = url.split('/').slice(2)
      const host = parts.shift()
      const path = `/${parts.join('/')}`
      const req = https.request({
        method: 'HEAD',
        port: 443,
        host,
        path
      }, (res) => {
        resolve(parseInt(res.headers['content-length']))
      })
      req.end()
    })

    const handler = async (data) => {
      for (const i1 in data.messages) {
        for (const i2 in data.messages[i1].content) {
          for (const i3 in data.messages[i1].content[i2].attachments) {
            const url = data.messages[i1].content[i2].attachments[i3]
            if (typeof url === 'string') {
              data.messages[i1].content[i2].attachments[i3] = {
                url: url,
                size: await sizeFetcher(url)
              }
            }
          }
        }
      }
      const rendered = ReactDOMServer.renderToStaticMarkup(React.createElement(Chat, data))
      res.end(html.replace('{chan}', data.channel_name).replace('{react}', rendered))
    }

    if (req.method === 'POST') {
      let data = ''
      req.on('data', chunk => (data += chunk))
      req.on('end', () => handler(JSON.parse(data)))
    } else {
      return handler(testData)
    }
  }).listen(config.port)
