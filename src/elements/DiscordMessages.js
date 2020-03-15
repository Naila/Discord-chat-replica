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

import { createElement } from '../utils'

const months = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
]

class DiscordMessages extends HTMLElement {
  connectedCallback () {
    let before = -1
    this.querySelectorAll('discord-message').forEach(msg => {
      const time = parseInt(msg.querySelector('message-date').dataset.timestamp)
      if (before > 0) {
        if (Math.floor((time - before) / 1000 / 60 / 60 / 24) > 0) {
          if (!msg.classList.contains('group-start')) msg.classList.add('group-start')
          const date = new Date(time)
          this.insertBefore(
            createElement('div', { class: 'divider' }, `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`),
            msg
          )
        }
      }
      before = time
    })
  }
}

customElements.define('discord-messages', DiscordMessages)
