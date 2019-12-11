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

export default class MessageGroup extends React.Component {
  render () {
    return <div className='message'>
      <img src={this.props.author.avatar} alt='avatar' className='avatar'/>
      <div className='details'>
        <div className='header'>
          <span className='name' data-copy-id={this.props.authorId}>{this.props.author.username}</span>
          {this.props.author.staff && <span className='badge'>Staff</span>}
          <span className='time' data-timestamp={this.props.time}>{new Date(this.props.time).toGMTString()}</span>
        </div>
        <div className='contents'>
          {this.props.content.map((msg, i) => <div key={i} className='msg'>{this.renderMarkdown(msg)}</div>)}
        </div>
      </div>
    </div>
  }

  renderMarkdown (str) {
    return str
  }
}
