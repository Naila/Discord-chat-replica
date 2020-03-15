/*
 * Small microservice to generate a Discord-like chat section
 * Copyright (C) 2020 Bowser65
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import e from '../utils/createElement'

class MessageAttachment extends HTMLElement {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }

  connectedCallback () {
    const el = this.querySelector('.preview')
    if (el) el.addEventListener('click', this.onClick)
  }

  async onClick () {
    this.renderModal('LOADING')
    const file = this.querySelector('a').href
    const res = await fetch(file.replace('https://cdn.discordapp.com', window.GLOBAL_ENV.HOSTNAME))
    if (!res.ok) {
      return this.renderModal('ERRORED')
    }
    this.renderModal('FETCHED', await res.text())
  }

  renderModal (state, contents) {
    const filename = this.querySelector('a').textContent
    let container = document.querySelector('.modal-container')
    if (!container) {
      const close = () => {
        const el = document.querySelector('.modal-container')
        el.classList.add('leaving')
        setTimeout(() => el.remove(), 150)
      }
      container = e('div', {
        class: 'modal-container entering',
        bindEvents: { click: close }
      }, e('div', {
        class: 'modal-inner',
        bindEvents: { click: e => e.stopPropagation() }
      }, e('div', { class: 'modal' }, [
        e('div', { class: 'modal-header' }, 'Attachment'),
        e('div', { class: 'modal-body' }, [
          e('div', null, [ e('b', null, 'Filename:'), ` ${filename}` ]),
          e('div', null, [ e('b', null, 'File size:'), ` ${this.querySelector('span').textContent}` ]),
          e('div', { class: 'attachment-details' })
        ]),
        e('div', { class: 'modal-footer' }, [
          e('button', { bindEvents: { click: close } }, 'Got it'),
          e('a', {
            href: this.querySelector('a').href,
            target: '_blank'
          }, 'Download')
        ])
      ])))
      document.body.appendChild(container)
    }

    let el = null
    switch (state) {
      case 'LOADING':
        el = e('div', { class: 'spinner' })
        break
      case 'FETCHED':
        el = e('div', { class: 'contents' }, [
          e('div', { class: 'lang' }, filename.split('.').pop()),
          e('div', { class: 'shitcode' }, [
            e('div', { class: 'lines' }),
            e('code', null, contents)
          ]),
          e('div', { class: 'copy' }, 'Copy')
        ])
        break
      case 'ERRORED':
        el = e('div', { class: 'error' }, 'Failed to load attachment contents.')
        break
    }
    const inner = container.querySelector('.attachment-details')
    inner.innerHTML = ''
    inner.appendChild(el)
  }
}

customElements.define('message-attachment', MessageAttachment)
