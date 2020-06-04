/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { showLargerImage } from '../utils'

class MessageImage extends HTMLImageElement {
  constructor () {
    super()
    this.onClick = () => showLargerImage(this)
    this.onError = this.onError.bind(this)
  }

  connectedCallback () {
    if (this.dataset.clickable !== void 0) {
      this.addEventListener('click', this.onClick)
    }
    this.addEventListener('error', this.onError)
  }

  onError () {
    this.removeEventListener('error', this.onError)
    this.removeEventListener('click', this.onClick)
    this.removeAttribute('data-clickable')
    this.src = 'https://discord.com/assets/e0c782560fd96acd7f01fda1f8c6ff24.svg'
  }
}

class MessageGifv extends HTMLVideoElement {
  constructor () {
    super()
    this.onClick = () => showLargerImage(this)
  }

  connectedCallback () {
    this.addEventListener('click', this.onClick)
  }
}

customElements.define('message-image', MessageImage, { extends: 'img' })
customElements.define('message-gifv', MessageGifv, { extends: 'video' })
