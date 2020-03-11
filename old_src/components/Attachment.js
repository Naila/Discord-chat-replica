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

import React from 'react'

const ext = {
  audio: [ 'mp3', 'ogg', 'wav', 'flac' ],
  video: [ 'mp4', 'webm', 'mov' ]
}

class Attachment extends React.Component {

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
