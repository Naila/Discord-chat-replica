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

const https = require('https')

module.exports = class Formatter {
  constructor (payload) {
    this.payload = payload
  }

  async format () {
    if (!this._validate()) {
      return [ 400, null ]
    }

    await this._formatAttachments()
    this._formatMessages()
    return this.payload
  }

  async _formatAttachments () {
    for (const i1 in this.payload.messages) {
      // noinspection JSUnfilteredForInLoop
      for (const i2 in this.payload.messages[i1].content) {
        // noinspection JSUnfilteredForInLoop
        for (const i3 in this.payload.messages[i1].content[i2].attachments) {
          // noinspection JSUnfilteredForInLoop
          const url = this.payload.messages[i1].content[i2].attachments[i3]
          if (typeof url === 'string') {
            // noinspection JSUnfilteredForInLoop
            this.payload.messages[i1].content[i2].attachments[i3] = {
              url,
              size: await this._fetchSize(url)
            }
          }
        }
      }
    }
  }

  _formatMessages () {
    let cursor = -1
    this.payload.grouppedMessages = []
    this.payload.messages.forEach(msg => {
      const lastMessage = cursor !== -1 ? [ ...this.payload.grouppedMessages[cursor] ].reverse()[0] : null
      if (!lastMessage || msg.author !== lastMessage.author || msg.time - lastMessage.time > 420000) {
        this.payload.grouppedMessages.push([])
        cursor++
      }
      this.payload.grouppedMessages[cursor].push(msg)
    })
    this.payload.grouppedMessages = this.payload.grouppedMessages.filter(a => a.length !== 0)
  }

  _validate () {
    return true // TODO
  }

  _fetchSize (url) {
    return new Promise(resolve => {
      const parts = url.split('/').slice(2)
      const host = parts.shift()
      const path = `/${parts.join('/')}`
      const req = https.request({
        method: 'HEAD',
        port: 443,
        host,
        path
      }, (res) => resolve(parseInt(res.headers['content-length'])))
      req.end()
    })
  }
}
