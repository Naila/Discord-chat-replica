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
import Markdown from '../src/markdown'

class Embed extends React.Component {
  renderAuthor () {
    return <div className='author'>
      {this.props.author.icon_url && <img src={this.props.author.icon_url} alt=''/>}
      {this.props.author.url
        ? <a href={this.props.author.url} target='_blank'>{this.props.author.name}</a>
        : <span>{this.props.author.name}</span>}
    </div>
  }

  renderFields () {
    let elBuffer = []
    const max = this.props.thumbnail ? 2 : 3
    return <div className='fields'>
      {this.props.fields.map((field, i) => {
        const rendered = <div className='field' key={`f${i}`}>
          <div className='title' dangerouslySetInnerHTML={{ __html: this.renderMarkdown(field.name) }}/>
          <div className='contents' dangerouslySetInnerHTML={{ __html: this.renderMarkdown(field.value, true) }}/>
        </div>
        if (field.inline) {
          elBuffer.push(rendered)
          if (elBuffer.length === max) {
            const res = <div key={i} className={`fields-row row-${max}`}>{elBuffer}</div>
            elBuffer = []
            return res
          }
        } else {
          const res = <div key={i} className='fields-row row-1'>{rendered}</div>
          if (elBuffer.length !== 0) {
            const arr = [ elBuffer, res ]
            elBuffer = []
            return arr
          }
          return res
        }
      })}
      {elBuffer.length !== 0 && <div className={[ 'fields-row', `row-${elBuffer.length}` ]}>
        {elBuffer}
      </div>}
    </div>
  }

  renderFooter () {
    return <div className='footer'>
      {this.props.footer.icon_url && <img src={this.props.footer.icon_url} alt=''/>}
      {<span>
        {this.props.footer.text}
        {this.props.footer.text && this.props.timestamp && ' | '}
        {this.props.timestamp && <span data-timestamp={new Date(this.props.timestamp).getTime()}>
          {new Date(this.props.timestamp).toGMTString()}
        </span>}
      </span>}
    </div>
  }

  render () {
    return <div
      className='message-embed'
      style={this.props.color ? { borderColor: this.int2rgb(this.props.color) } : {}}
    >
      <div className='inner'>
        <div className='content'>
          {this.props.author && this.renderAuthor()}
          {this.props.title && (
            this.props.url
              ? <a
                href={this.props.url} target='_blank' className='title'
                dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.title) }}
              />
              : <div className='title' dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.title) }}/>
          )}
          {this.props.description &&
          <div
            className='description'
            dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.description, true) }}
          />}
          {this.props.fields && this.renderFields()}
        </div>
        {this.props.thumbnail && <img data-enlargable='' src={this.props.thumbnail.url} alt='' className='thumbnail'/>}
      </div>
      {this.props.image && <img data-enlargable='' src={this.props.image.url} alt='' className='image'/>}
      {(this.props.footer || this.props.timestamp) && this.renderFooter()}
    </div>
  }

  renderMarkdown (md, ext) {
    return Markdown.renderMarkdown(md, this.props.entities, ext)
  }

  int2rgb (int) {
    return `rgb(${int >> 16 & 255}, ${int >> 8 & 255}, ${255 & int})`
  }
}
