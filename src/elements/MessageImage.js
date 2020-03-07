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

import Engine from '../components/engine'
import ImagePreview from '../components/ImagePreview'

class MessageImage extends HTMLImageElement {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
    this.onError = this.onError.bind(this)
  }

  connectedCallback () {
    console.log(this.dataset)
    if (this.dataset.clickable) {
      this.addEventListener('click', this.onClick)
    }
    this.addEventListener('error', this.onError)
  }

  onError () {
    this.removeEventListener('error', this.onError)
    this.removeEventListener('click', this.onClick)
    this.removeAttribute('data-clickable')
    this.src = 'https://canary.discordapp.com/assets/e0c782560fd96acd7f01fda1f8c6ff24.svg'
  }

  onClick () {
    Engine.mount(Engine.createElement(ImagePreview, { image: this.src }))
  }
}

customElements.define('message-image', MessageImage, { extends: 'img' })
