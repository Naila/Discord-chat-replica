/*
 * Copyright (c) 2020 Cynthia K. Rey
 * Licensed under the Open Software License version 3.0
 */

const { readFileSync } = require('fs')
const { join } = require('path')

const script = readFileSync(join(__dirname, '..', 'dist', 'script.js'))
const style = readFileSync(join(__dirname, '..', 'dist', 'style.css'))

module.exports = { style, script }
