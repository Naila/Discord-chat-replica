/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
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
