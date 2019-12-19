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
import Attachment from './Attachment'
import Embed from './Embed'
import Markdown from '../src/markdown'

export default class MessageGroup extends React.Component {
  render () {
    return <div
      className='message'
      data-timestamp={this.props.time}
      data-author-id={this.props.authorId}
      data-author-name={this.props.author.username}
      data-author-avatar={this.props.author.avatar}
      data-author-discrim={this.props.author.discriminator}
      data-author-badge={this.props.author.badge}
      data-msg-count={this.props.content.length}
    >
      <img src={this.props.author.avatar} alt='avatar' className='avatar'/>
      <div className='details'>
        <div className='header'>
          <span className='name'>
            {this.props.author.username}
          </span>
          {this.props.author.badge && <span className='badge'>{this.props.author.badge}</span>}
          <span className='time'>{new Date(this.props.time).toGMTString()}</span>
        </div>
        <div className='contents'>
          {this.props.content.map((msg, i) => <div key={i} className='msg'>
            <div key={i} className='markup' dangerouslySetInnerHTML={{ __html: Markdown.renderMarkdown(msg.msg) }}/>
            {this.renderAttachments(msg)}
            {msg.embed && <Embed {...msg.embed}/>}
          </div>)}
        </div>
      </div>
    </div>
  }

  renderAttachments (msg) {
    const attachments = []
    if (msg.attachments) {
      msg.attachments.forEach((attachment, i) => {
        if (attachment.url.match(Markdown.imgRegex)) {
          attachments.push(<img data-enlargable='' key={i} src={attachment.url} alt=''/>)
        } else {
          attachments.push(<Attachment key={i} {...attachment}/>)
        }
      })
    }

    const urls = msg.msg.match(Markdown.urlRegex) || []
    for (const url of urls) {
      const proxyUrl = url.replace(/(https?):\//, 'https://proxy.kanin.dev/$1')
      if (Markdown.imgRegex.test(url)) {
        attachments.push(<img data-enlargable='' key={url} src={proxyUrl} alt=''/>)
      } else if (Markdown.audioRegex.test(url)) {
        attachments.push(<audio key={url} src={proxyUrl} controls controlsList="nodownload"/>)
      } else if (Markdown.videoRegex.test(url)) {
        attachments.push(<video key={url} src={proxyUrl} controls controlsList="nodownload"/>)
      }
    }
    return attachments
  }
}
