/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

class MessageMarkup extends HTMLElement {
  connectedCallback () {
    const actualNodes = [ ...this.childNodes ].filter(n => !(n instanceof HTMLBRElement))
    if (actualNodes.length < 28 && !actualNodes.find(n => !n.classList || !n.classList.contains('emoji'))) {
      actualNodes.forEach(n => n.classList.add('jumbo'))
    }
  }
}

customElements.define('message-markup', MessageMarkup)
