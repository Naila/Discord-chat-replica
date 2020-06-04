/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { createTooltip } from '../utils'

class MessageEmoji extends HTMLImageElement {
  constructor () {
    super()
    this.onError = this.onError.bind(this)
  }

  connectedCallback () {
    this.addEventListener('error', this.onError)
    createTooltip(this, this.alt)
  }

  onError () {
    this.parentNode.replaceChild(document.createTextNode(this.alt), this)
  }
}

customElements.define('message-emoji', MessageEmoji, { extends: 'img' })
