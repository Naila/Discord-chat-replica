/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { copy, contextMenu } from '../utils'

class DiscordMessage extends HTMLElement {
  connectedCallback () {
    contextMenu(this, [ {
      name: 'Copy Message ID',
      callback: () => copy(this.dataset.id)
    } ])
    contextMenu(this.querySelector('.avatar'), [ {
      name: 'Copy Avatar URL',
      callback: () => copy(this.querySelector('.avatar').src)
    }, {
      name: 'Copy User ID',
      callback: () => copy(this.dataset.author)
    } ])
    contextMenu(this.querySelector('message-header .name'), [ {
      name: 'Copy User ID',
      callback: () => copy(this.dataset.author)
    } ])
  }
}

customElements.define('discord-message', DiscordMessage)
