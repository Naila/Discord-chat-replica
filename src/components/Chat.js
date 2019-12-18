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
import HeaderBar from './HeaderBar'
import MessageGroup from './MessageGroup'

const Chat = (props) => <>
  <HeaderBar
    channelName={props.channel_name}
    messagesCount={props.messages.reduce((red, m) => (red += m.content.length), 0)}
  />
  <div className='messages'>
    {props.messages.map((message, i) => <MessageGroup
      author={props.users[message.author]}
      authorId={message.author}
      content={message.content}
      time={message.time}
      key={i}
    />)}
  </div>
</>

export default Chat
