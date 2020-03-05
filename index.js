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
const ejs = require('ejs')

const Formatter = require('./formatter')

// Stuff
const config = require('./config')
const manifest = require('./dist/manifest')
const testData = require('./example')

require('http')
  .createServer((req, res) => {
    if (![ 'GET', 'POST' ].includes(req.method)) {
      res.writeHead(405)
      res.end()
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

    const handler = async (data) => {
      const fm = new Formatter(data)
      ejs.renderFile('./views/index.ejs', { data: await fm.format(), manifest }, null, (err, str) => {
        if (err) {
          res.writeHead(500)
          res.end('Internal Server Error')
          console.error(err)
        }
        res.end(str)
      })
    }

    if (req.method === 'POST') {
      let data = ''
      req.on('data', chunk => (data += chunk))
      req.on('end', () => handler(JSON.parse(data)))
    } else {
      return handler(testData)
    }
  }).listen(config.port)
