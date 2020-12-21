/*
 * Copyright (c) 2020 Cynthia K. Rey
 * Licensed under the Open Software License version 3.0
 */

import { lateDefine, createTooltip } from '../utils'

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

lateDefine('message-emoji', MessageEmoji, { extends: 'img' })
