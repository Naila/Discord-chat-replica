/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

function createElement (element, attributes = {}, children = null) {
  if (!attributes) attributes = {}

  if (typeof element === 'string') {
    const node = document.createElement(element)
    for (const attr in attributes) {
      if (attr === 'bindEvents') {
        for (const event of Object.keys(attributes.bindEvents)) {
          node.addEventListener(event, attributes.bindEvents[event])
        }
      } else {
        node.setAttribute(attr, attributes[attr])
      }
    }
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child instanceof Node) {
          // noinspection JSUnfilteredForInLoop
          node.appendChild(child)
        } else if (typeof child === 'string') {
          // noinspection JSUnfilteredForInLoop
          node.appendChild(document.createTextNode(child))
        }
      }
    } else if (children instanceof Node) {
      node.appendChild(children)
    } else if (typeof children === 'string') {
      node.appendChild(document.createTextNode(children))
    }
    return node
  }
  throw new Error('Failed to create component. You may only pass a string or a Component.')
}

export default createElement
