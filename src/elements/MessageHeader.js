/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { createUserPopout } from '../utils'

class MessageHeader extends HTMLElement {
  connectedCallback () {
    const image = this.parentElement.previousElementSibling.previousElementSibling
    createUserPopout(this.querySelector('.name'), {
      id: this.parentElement.parentElement.dataset.author,
      username: this.querySelector('.name').textContent,
      discriminator: image.dataset.discriminator,
      avatar: image.src,
      badge: this.querySelector('.badge').textContent
    })
  }
}

customElements.define('message-header', MessageHeader)
