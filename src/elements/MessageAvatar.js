/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { createUserPopout } from '../utils'

class MessageAvatar extends HTMLImageElement {
  constructor () {
    super()
    this.onError = this.onError.bind(this)
  }

  connectedCallback () {
    this.addEventListener('error', this.onError)
    const contents = this.nextElementSibling.nextElementSibling
    createUserPopout(this, {
      id: this.parentElement.dataset.author,
      username: contents.querySelector('.name').textContent,
      discriminator: this.dataset.discriminator,
      avatar: this.src,
      badge: contents.querySelector('.badge').textContent
    })
  }

  onError () {
    this.removeEventListener('error', this.onError)
    const discriminator = parseInt(this.dataset.discriminator) || 0
    this.src = `https://cdn.discordapp.com/embed/avatars/${discriminator % 4}.png`
  }
}

customElements.define('message-avatar', MessageAvatar, { extends: 'img' })
