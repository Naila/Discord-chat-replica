/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
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
