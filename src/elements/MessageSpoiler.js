/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

class MessageSpoiler extends HTMLSpanElement {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }

  connectedCallback () {
    this.addEventListener('click', this.onClick)
  }

  onClick () {
    this.classList.add('revealed')
    this.removeEventListener('click', this.onClick)
  }
}

customElements.define('message-spoiler', MessageSpoiler, { extends: 'span' })
