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

import { copy } from '../utils'

class MessageCodeblock extends HTMLPreElement {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
    this.animation = false
  }

  connectedCallback () {
    this.copyElement = this.querySelector('.copy')
    this.copyElement.addEventListener('click', this.onClick)
  }

  onClick () {
    if (this.animation) return
    this.animation = true
    this.copyElement.classList.add('success')
    this.copyElement.innerText = 'Copied!'
    copy(this.querySelector('code').textContent)

    setTimeout(() => {
      this.copyElement.classList.remove('success')
      this.copyElement.innerText = 'Copy'
    }, 3e3)
  }
}

customElements.define('message-codeblock', MessageCodeblock, { extends: 'pre' })
