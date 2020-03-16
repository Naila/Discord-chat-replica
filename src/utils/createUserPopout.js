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
import MessageDate from '../elements/MessageDate'

function createUserPopout (element, user) {
  const popout = renderPopout(user)
  popout.addEventListener('click', e => e.stopPropagation())
  element.addEventListener('click', () => {
    // Add element
    document.body.appendChild(popout)

    // Place element
    const elementRect = element.getBoundingClientRect()
    const popoutRect = popout.getBoundingClientRect()
    popout.style.left = `${elementRect.x + elementRect.width + 10}px`
    popout.style.top = `${Math.min(elementRect.y, window.innerHeight - popoutRect.height - 15)}px`
    popout.classList.add('mounted')

    // Window events
    setTimeout(() => {
      const callback = () => {
        popout.remove()
        popout.classList.remove('mounted')
        window.removeEventListener('click', callback)
      }
      window.addEventListener('click', callback)
    }, 0)
  })
}

function renderPopout (user) {
  // eslint-disable-next-line no-undef
  const date = new Date(Number((BigInt(user.id) >> 22n) + 1420070400000n))
  return e('div', { class: 'user-popout' }, [
    e('div', { class: 'header' }, [
      e('img', {
        src: user.avatar,
        alt: 'avatar'
      }),
      e('div', { class: 'details' }, [
        e('div', { class: 'username' }, user.username),
        e('div', { class: 'discriminator' }, [ '#', user.discriminator ]),
        e('div', { class: 'badge' }, user.badge)
      ])
    ]),
    e('div', { class: 'body' }, [
      e('div', { class: 'field' }, [
        e('div', { class: 'title' }, 'Account Creation Date'),
        e('div', { class: 'value' }, MessageDate.formatDate(date))
      ]),
      e('div', { class: 'field' }, [
        e('div', { class: 'title' }, 'Messages Count'),
        e('div', { class: 'value' }, document.querySelectorAll(`discord-message[data-author="${user.id}"]`).length.toString())
      ])
    ])
  ])
}

export default createUserPopout
