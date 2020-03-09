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

class MessageVideo extends HTMLDivElement {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }

  connectedCallback () {
    document.querySelector('.play').addEventListener('click', this.onClick)
  }

  onClick () {
    this.innerHTML = ''
    const iframe = document.createElement('iframe')
    iframe.width = parseInt(this.style.width).toString()
    iframe.height = parseInt(this.style.height).toString()
    iframe.frameBorder = '0'
    iframe.allowFullscreen = true
    const url = new URL(this.dataset.url)
    url.searchParams.append('autoplay', '1')
    url.searchParams.append('auto_play', '1')
    iframe.src = url.href
    this.appendChild(iframe)
  }
}

customElements.define('message-video', MessageVideo, { extends: 'div' })
