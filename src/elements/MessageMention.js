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

import { copy, contextMenu, createUserPopout } from '../utils'

class MessageMention extends HTMLElement {
  connectedCallback () {
    contextMenu(this, [ {
      name: `Copy ${this.dataset.type[0].toUpperCase() + this.dataset.type.slice(1)} ID`,
      callback: () => copy(this.dataset.id)
    } ])
    if (this.dataset.type === 'user') {
      createUserPopout(this, {
        username: this.dataset.username || '',
        discriminator: this.dataset.discriminator || '',
        avatar: this.dataset.avatar || '',
        badge: this.dataset.badge || ''
      })
    }
  }
}

customElements.define('message-mention', MessageMention)
