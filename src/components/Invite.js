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

import Component from './Component'
import Engine from './engine'

const e = Engine.createElement

class Invite extends Component {
  render () {
    const { invite } = this.props
    //
    switch (this.props.state) {
      case 'RESOLVING':
        return [
          e('div', { class: 'header' }, 'Resolving Invite'),
          e('div', { class: 'resolving' }) // Discord's animation is borken sadpepe
        ]
      case 'INVALID':
        return [
          e('div', { class: 'header' }, 'You received an invite, but...'),
          e('div', { class: 'guild' }, [
            e('img', {
              src: 'https://canary.discordapp.com/assets/e0c782560fd96acd7f01fda1f8c6ff24.svg',
              alt: 'poop'
            }),
            e('div', { class: 'invalid' }, 'Invalid Invite')
          ])
        ]
      case 'RESOLVED':
        return [
          e('div', { class: 'header' }, 'You\'ve been invited to join a server'),
          e('div', { class: 'guild' }, [
            e('img', {
              src: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.${invite.guild.icon.startsWith('a_') ? 'gif' : 'png'}`,
              alt: 'Guild Icon'
            }),
            e('div', { class: 'details' }, [
              e('div', { class: 'name' }, invite.guild.name),
              e('div', { class: 'counts' }, [
                e('div', { class: 'online' }),
                e('span', { class: 'count' }, [
                  e('b', null, invite.approximate_presence_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')),
                  'Online'
                ]),
                e('div', { class: 'offline' }),
                e('span', { class: 'count' }, [
                  e('b', null, invite.approximate_member_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')),
                  'Members'
                ])
              ])
            ]),
            e('a', {
              href: `https://discordapp.com/invite/${invite.code}`,
              target: '_blank',
              class: 'button'
            }, 'Join')
          ])
        ]
    }
  }
}

export default Invite
