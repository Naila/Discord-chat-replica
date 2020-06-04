/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import e from './createElement'
import fit from '../commons/fit'

function showLargerImage (element) {
  const url = new URL(element.src)
  const size = zoomFit(parseInt(element.dataset.width), parseInt(element.dataset.height))
  url.searchParams.set('width', size.width)
  url.searchParams.set('height', size.height)
  document.body.appendChild(
    e('div', {
      class: 'modal-container entering',
      bindEvents: {
        click: () => {
          const el = document.querySelector('.modal-container')
          el.classList.add('leaving')
          setTimeout(() => el.remove(), 150)
        }
      }
    }, e('div', {
      class: 'modal-inner image',
      bindEvents: { click: e => e.stopPropagation() }
    }, [
      element.classList.contains('video')
        ? e('video', {
          src: element.src,
          autoplay: true,
          muted: true,
          loop: true,
          style: `width: ${size.width}px; height: ${size.height}px;`
        })
        : e('img', {
          src: url.href,
          alt: 'Preview',
          style: `width: ${size.width}px; height: ${size.height}px;`
        }),
      e('a', {
        href: element.dataset.url,
        target: '_blank'
      }, 'Open original')
    ]))
  )
  setTimeout(() => document.querySelector('.modal-container').classList.remove('entering'), 350)
}

function zoomFit (width, height) {
  const maxWidth = Math.min(Math.round(0.65 * window.innerWidth), 2e3)
  const maxHeight = Math.min(Math.round(0.65 * window.innerHeight), 2e3)
  return fit(width, height, maxWidth, maxHeight)
}

export default showLargerImage
