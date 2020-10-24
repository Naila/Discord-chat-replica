/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const http2 = require('http2')
const path = require('path')
const fs = require('fs')

const fonts = Object.entries({
  Whitney400: 'e8acd7d9bf6207f99350ca9f9e23b168',
  Whitney500: '3bdef1251a424500c1b3a78dea9b7e57',
  Whitney600: 'be0060dafb7a0e31d2a1ca17c0708636',
  Whitney700: '8e12fb4f14d9c4592eb8ec9f22337b04'
})

const client = http2.connect('https://discord.com:443')
Promise.all(
  fonts.map(([ font, hash ]) => new Promise(resolve => {
    const chunks = []
    const dest = path.join(__dirname, `/dist/${font}.woff`)
    const req = client.request({ ':path': `/assets/${hash}.woff` })
    req.on('data', chk => chunks.push(chk))
    req.on('end', () => fs.writeFileSync(dest, Buffer.concat(chunks)) | resolve())
    req.end()
  }))
).then(() => console.log('Downloaded fonts.') | client.close())
