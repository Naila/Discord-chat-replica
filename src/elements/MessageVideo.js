/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
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
