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

import React from 'react'

const ext = {
  audio: [ 'mp3', 'ogg', 'wav', 'flac' ],
  video: [ 'mp4', 'webm', 'mov' ]
}

export default class Attachment extends React.Component {
  formatBytes (bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  computeIconHash (filename) {
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

  renderDownload (url) {
    return <a href={url} target='_blank' className='download'>
      <svg width='24' height='24' viewBox='0 0 24 24'>
        <path fill='currentColor' d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/>
      </svg>
    </a>
  }

  renderVideo (url, size) {
    return <div className='video-embed'>
      <div className='metadata'>
        <div className='details'>
          <span className='name'>{url.match(/[^#?]*/)[0].split('/').pop()}</span>
          <span className='size'>{this.formatBytes(size)}</span>
        </div>
        {this.renderDownload(url)}
      </div>
      <video src={url} controls controlsList="nodownload" disablePictureInPicture/>
    </div>
  }

  render () {
    const { url, size } = this.props
    const classes = [ 'attachment', ext.audio.includes(url.split('.').pop()) && 'audio' ]
    return ext.video.includes(url.split('.').pop())
      ? this.renderVideo(url, size)
      : <div className={classes.filter(Boolean).join(' ')}>
        <div className='data'>
          <img src={`https://discordapp.com/assets/${this.computeIconHash(url)}.svg`} alt='' className='icon'/>
          <div className='details'>
            <a href={url} target='_blank'>{url.split('/').pop()}</a>
            <span>{this.formatBytes(size)}</span>
          </div>
          {this.renderDownload(url)}
        </div>
        {ext.audio.includes(url.split('.').pop()) && <audio src={url} controls controlsList="nodownload"/>}
      </div>
  }
}
