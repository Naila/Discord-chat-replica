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
          const size = this._fit(attachment.width, attachment.height, 400, 300)
          attachment.displayMaxWidth = `${size.width}px`
          attachment.displayMaxHeight = `${size.height}px`
        }

        attachment.formattedBytes = this._formatBytes(attachment.size)
        attachment.iconHash = this._computeIconHash(attachment.filename)
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
          const size = this._fit(media.width, media.height, 400, 300)
          embed.displayMaxWidth = `${size.width + 32}px`
          embed.displayMaxHeight = `${size.height}px`
        }
        if (embed.image) {
          const size = this._fit(embed.image.width, embed.image.height, 400, 300)
          embed.image.displayMaxWidth = `${size.width}px`
          embed.image.displayMaxHeight = `${size.height}px`
        }
        if (embed.type === 'image' && embed.thumbnail) {
          const size = this._fit(embed.thumbnail.width, embed.thumbnail.height, 400, 300)
          embed.thumbnail.displayMaxWidth = `${size.width}px`
          embed.thumbnail.displayMaxHeight = `${size.height}px`
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

  _formatBytes (bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  _computeIconHash (filename) {
    if (/\.pdf$/.test(filename)) {
      return 'f167b4196f02faf2dc2e7eb266a24275'
    }
    if (/\.ae/.test(filename)) {
      return '982bd8aedd89b0607f492d1175b3b3a5'
    }
    if (/\.sketch$/.test(filename)) {
      return 'f812168e543235a62b9f6deb2b094948'
    }
    if (/\.ai$/.test(filename)) {
      return '03ad68e1f4d47f2671d629cfeac048ef'
    }
    if (/\.(?:rar|zip|7z|tar|tar\.gz)$/.test(filename)) {
      return '73d212e3701483c36a4660b28ac15b62'
    }
    if (/\.(?:c\+\+|cpp|cc|c|h|hpp|mm|m|json|js|rb|rake|py|asm|fs|pyc|dtd|cgi|bat|rss|java|graphml|idb|lua|o|gml|prl|sls|conf|cmake|make|sln|vbe|cxx|wbf|vbs|r|wml|php|bash|applescript|fcgi|yaml|ex|exs|sh|ml|actionscript)$/.test(filename)) {
      return '481aa700fab464f2332ca9b5f4eb6ba4'
    }
    if (/\.(?:txt|rtf|doc|docx|md|pages|ppt|pptx|pptm|key|log)$/.test(filename)) {
      return '85f7a4063578f6e0e2c73f60bca0fcce'
    }
    if (/\.(?:xls|xlsx|numbers|csv)$/.test(filename)) {
      return '85f7a4063578f6e0e2c73f60bca0fcce'
    }
    if (/\.(?:html|xhtml|htm|js|xml|xls|xsd|css|styl)$/.test(filename)) {
      return 'a11e895b46cde503a094dd31641060a6'
    }
    if (/\.(?:mp3|ogg|wav|flac)$/.test(filename)) {
      return '5b0da31dc2b00717c1e35fb1f84f9b9b'
    }
    return '985ea67d2edab4424c62009886f12e44'
  }
}
