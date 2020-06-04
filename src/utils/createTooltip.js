/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import e from './createElement'

function createTooltip (element, text, placement = 'top') {
  const tooltip = e('div', { class: `tooltip ${placement}` }, text)
  let timeout = null

  element.addEventListener('mouseenter', () => {
    timeout = setTimeout(() => {
      timeout = null
      document.body.appendChild(tooltip)
      const tooltipRect = tooltip.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      if (placement === 'top') {
        tooltip.style.left = `${elementRect.x + (elementRect.width / 2) - (tooltipRect.width / 2)}px`
        tooltip.style.top = `${elementRect.y - tooltipRect.height - 5}px`
      } else if (placement === 'right') {
        tooltip.style.left = `${elementRect.x + elementRect.width + 10}px`
        tooltip.style.top = `${elementRect.y + (elementRect.height / 2) - (tooltipRect.height / 2)}px`
      }

      tooltip.classList.add('entering')
      setTimeout(() => tooltip.classList.remove('entering'), 150)
    }, 1e3)
  })

  element.addEventListener('mouseleave', () => {
    tooltip.classList.add('leaving')
    setTimeout(() => {
      tooltip.remove()
      tooltip.classList.remove('leaving')
    }, 150)
    if (timeout) {
      clearTimeout(timeout)
    }
  })
}

export default createTooltip
