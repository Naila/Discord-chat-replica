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
const Chat = require('./dist/Chat')
const testData = require('./example')
const config = require('./config')
const html = readFileSync('index.html', 'utf8')

require('http')
  .createServer((req, res) => {
    if (!['GET', 'POST'].includes(req.method)) {
      res.writeHead(404)
      res.end()
    }
    const handler = async (data) => {
      data.messages = await Promise.all(
        data.messages.map(async msg => {
          msg.content = await Promise.all(
            msg.content.map(async c => {
              if (c.attachments) {
                c.attachments = await Promise.all(
                  c.attachments.map(async a => {
                    if (a.url) return a
                    return {
                      url: a,
                      size: await new Promise(resolve => {
                        const parts = a.split('/').slice(2)
                        const host = parts.shift()
                        const path = `/${parts.join('/')}`
                        const req = https.request({
                          method: 'HEAD',
                          host, path,
                          port: 443
                        }, (res) => {
                          resolve(parseInt(res.headers['content-length']))
                        })
                        req.end()
                      })
                    }
                  })
                )
              }
              return c
            })
          )
          return msg
        })
      )
      const rendered = ReactDOMServer.renderToStaticMarkup(React.createElement(Chat.default, data))
      res.end(html.replace('{react}', rendered))
    }

    if (req.method === 'POST') {
      let data = ''
      req.on('data', chunk => data += chunk)
      req.on('end', () => handler(JSON.parse(data)))
    } else {
      handler(testData)
    }
  }).listen(config.port)
