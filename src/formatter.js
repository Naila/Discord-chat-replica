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

module.exports = class Formatter {
  constructor (payload) {
    this.payload = payload
  }

  async format () {
    if (!this._validate()) {
      return null
    }

    await this._formatAttachments()
    this._mergeEmbeds()
    this._formatEmbeds()
    await this._formatMessages()
    return this.payload
  }

  async _formatAttachments () {
    for (const i1 in this.payload.messages) {
      // noinspection JSUnfilteredForInLoop
      for (const i2 in this.payload.messages[i1].attachments) {
        // noinspection JSUnfilteredForInLoop
        const attachment = this.payload.messages[i1].attachments[i2]
        if (attachment.width && attachment.height) {
          attachment.displayMaxWidth = `${this._fit(attachment.width, attachment.height, 400, 300).width}px`
        }
      }
    }
  }

  _mergeEmbeds () {
    for (const i1 in this.payload.messages) {
      // noinspection JSUnfilteredForInLoop
      if (this.payload.messages[i1].embeds) {
        // noinspection JSUnfilteredForInLoop
        const msg = this.payload.messages[i1]
        const { embeds } = msg
        msg.embeds = []
        embeds.forEach(embed => {
          if (embed.url && embed.image) {
            const match = msg.embeds.find(e => e.url === embed.url)
            if (match) {
              if (!match.images) {
                match.images = []
                if (match.image) match.images.push(match.image)
              }
              if (embed.image) match.images.push(embed.image)
              return
            }
          }
          msg.embeds.push(embed)
        })
      }
    }
  }

  _formatEmbeds () {
    for (const i1 in this.payload.messages) {
      // noinspection JSUnfilteredForInLoop
      for (const i2 in this.payload.messages[i1].embeds) {
        // noinspection JSUnfilteredForInLoop
        const embed = this.payload.messages[i1].embeds[i2]

        // Group images
        if (embed.images) {
          embed.grouppedImages = [ [], [] ]
          embed.images.forEach((img, i) => embed.grouppedImages[embed.images.length - i <= 2 ? 1 : 0].push(img))
        }

        // Group fields
        if (embed.fields) {
          let cursor = -1
          const limit = embed.thumbnail ? 2 : 3
          embed.grouppedFields = []
          embed.fields.forEach(field => {
            const lastField = cursor !== -1 ? [ ...embed.grouppedFields[cursor] ].reverse()[0] : null
            if (!lastField || !lastField.inline || !field.inline || embed.grouppedFields[cursor].length === limit) {
              embed.grouppedFields.push([])
              cursor++
            }
            embed.grouppedFields[cursor].push(field)
          })
        }

        // Compute display width
        embed.displayMaxWidth = '520px'
        const media = embed.image || embed.video
        if (media) {
          embed.displayMaxWidth = `${this._fit(media.width, media.height, 400, 300).width + 32}px`
        }
        if (embed.image) {
          embed.image.displayMaxWidth = `${this._fit(embed.image.width, embed.image.height, 400, 300).width}px`
        }
        if (embed.type === 'image' && embed.thumbnail) {
          embed.thumbnail.displayMaxWidth = `${this._fit(embed.thumbnail.width, embed.thumbnail.height, 400, 300).width}px`
        }
        if (embed.video) {
          const size = this._fit(embed.video.width, embed.video.height, 400, 300)
          embed.video.displayMaxWidth = `${size.width}px`
          embed.video.displayMaxHeight = `${size.height}px`
        }
      }
    }
  }

  async _formatMessages () {
    let cursor = -1
    this.payload.grouppedMessages = []
    for (const msg of this.payload.messages) {
      if (msg.content) {
        await this._parseInvites(msg)
      }
      const lastMessage = cursor !== -1 ? [ ...this.payload.grouppedMessages[cursor] ].reverse()[0] : null
      if (!lastMessage || msg.author !== lastMessage.author || msg.time - lastMessage.time > 420000) {
        this.payload.grouppedMessages.push([])
        cursor++
      }
      this.payload.grouppedMessages[cursor].push(msg)
    }
    this.payload.grouppedMessages = this.payload.grouppedMessages.filter(a => a.length !== 0)
  }

  async _parseInvites (msg) {
    msg.invites = []
    const regex = /(?: |^)(?:https?:\/\/)?discord\.gg\/([a-zA-Z0-9-]+)/g
    for (const match of msg.content.matchAll(regex)) {
      msg.invites.push(match[1])
    }
  }

  _validate () {
    return true // TODO
  }

  _fit (width, height, maxWidth, maxHeight) {
    if (width !== maxWidth || height !== maxHeight) {
      const widthRatio = width > maxWidth ? maxWidth / width : 1
      width = Math.max(Math.round(width * widthRatio), 0)
      height = Math.max(Math.round(height * widthRatio), 0)

      const heightRatio = height > maxHeight ? maxHeight / height : 1
      width = Math.max(Math.round(width * heightRatio), 0)
      height = Math.max(Math.round(height * heightRatio), 0)
    }

    return {
      width,
      height
    }
  }
}
