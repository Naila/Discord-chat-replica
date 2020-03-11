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

import createElement from './createElement'

function createTooltip (element, text, placement = 'top') {
  const tooltip = createElement('div', { class: `tooltip ${placement}` }, text)
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
