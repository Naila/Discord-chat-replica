/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
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
