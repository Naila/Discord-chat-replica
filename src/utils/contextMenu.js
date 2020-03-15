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

import e from './createElement'

function contextMenu (element, options) {
  if (!element) return
  const context = e('div', { class: 'context-menu' },
    options.map(opt => e('div', {
      class: 'item',
      bindEvents: {
        click: () => {
          context.remove()
          opt.callback()
        }
      }
    }, opt.name))
  )

  element.addEventListener('contextmenu', event => {
    // Event memes
    event.preventDefault()
    event.stopPropagation()

    // Remove any previous context menu
    const el = document.querySelector('.context-menu')
    if (el) el.remove()

    // Add element
    document.body.appendChild(context)

    // Place element
    const contextRect = context.getBoundingClientRect()
    context.style.left = `${event.x}px`
    context.style.top = `${Math.min(event.y, window.innerHeight - contextRect.height - 15)}px`

    // Window events
    setTimeout(() => {
      const callback = () => {
        context.remove()
        window.removeEventListener('click', callback)
      }
      window.addEventListener('click', callback)
    }, 0)
  })
}

export default contextMenu
