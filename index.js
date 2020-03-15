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

const { existsSync, createReadStream } = require('fs')
const { resolve } = require('path')
const mime = require('mime-types')
const https = require('https')
const ejs = require('ejs')
const { minify } = require('html-minifier')

const markdown = require('./src/markdown')
const Formatter = require('./src/formatter')

// Stuff
const assets = require('./src/assets')
const config = require('./config')
const testData = require('./example')

require('http')
  .createServer((req, res) => {
    if (![ 'GET', 'POST' ].includes(req.method)) {
      res.writeHead(405)
      return res.end()
    }

    // Assets
    if (req.url.startsWith('/dist/')) {
      const target = req.url.split('/')[2]
      const file = resolve(__dirname, 'dist', target)
      if (existsSync(file) && target && target !== '.' && target !== '..') {
        res.setHeader('content-type', mime.lookup(file) || 'application/octet-stream')
        return createReadStream(file).pipe(res)
      }
    }

    // Attachments
    if (req.url.startsWith('/attachments/')) {
      console.log(req.url)
      https.get({
        host: 'cdn.discordapp.com',
        path: req.url,
        port: 443
      }, resp => {
        delete resp.headers['content-disposition']
        res.writeHead(resp.statusCode, {
          ...resp.headers,
          'Access-Control-Allow-Origin': '*'
        })
        resp.pipe(res)
      })
      return
    }

    // Serve
    const handler = async (data) => {
      const fm = new Formatter(data)
      const formatted = await fm.format()
      if (!formatted) {
        res.writeHead(400)
        return res.end()
      }
      ejs.renderFile('./views/index.ejs', {
        data: formatted,
        assets,
        markdown,
        req
      }, null, (err, str) => {
        if (err) {
          res.writeHead(500)
          res.end('Internal Server Error')
          console.error(err)
        }
        res.end(minify(str, {
          collapseWhitespace: true,
          removeComments: true
        }))
      })
    }

    res.setHeader('content-type', 'text/html')
    if (req.method === 'POST') {
      let data = ''
      req.on('data', chunk => (data += chunk))
      req.on('end', () => handler(JSON.parse(data)))
    } else {
      return handler(testData)
    }
  }).listen(config.port)
