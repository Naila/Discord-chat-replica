/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { createElement as e } from '../utils'

class DiscordInvite extends HTMLElement {
  async connectedCallback () {
    this.render('RESOLVING')
    const invite = await this.fetchInvite()
    if (invite) return this.render('RESOLVED', invite)
    this.render('INVALID')
  }

  render (state, invite) {
    this.innerHTML = ''
    let elements = []
    switch (state) {
      case 'RESOLVING':
        elements = [
          e('div', { class: 'header' }, 'Resolving Invite'),
          e('div', { class: 'resolving' }) // Discord's animation is borken sadpepe
        ]
        break
      case 'INVALID':
        elements = [
          e('div', { class: 'header' }, 'You received an invite, but...'),
          e('div', { class: 'guild' }, [
            e('img', {
              src: 'https://discord.com/assets/e0c782560fd96acd7f01fda1f8c6ff24.svg',
              alt: 'poop'
            }),
            e('div', { class: 'invalid' }, 'Invalid Invite')
          ])
        ]
        break
      case 'RESOLVED':
        elements = [
          e('div', { class: 'header' }, 'You\'ve been invited to join a server'),
          e('div', { class: 'guild' }, [
            e('img', {
              src: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.${invite.guild.icon.startsWith('a_') ? 'gif' : 'png'}`,
              alt: 'Guild Icon'
            }),
            e('div', { class: 'details' }, [
              e('div', { class: 'name' }, invite.guild.name),
              e('div', { class: 'counts' }, [
                e('div', { class: 'online' }),
                e('span', { class: 'count' }, [
                  e('b', null, invite.approximate_presence_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')),
                  'Online'
                ]),
                e('div', { class: 'offline' }),
                e('span', { class: 'count' }, [
                  e('b', null, invite.approximate_member_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')),
                  'Members'
                ])
              ])
            ]),
            e('a', {
              href: `https://discord.gg/${invite.code}`,
              target: '_blank',
              class: 'button'
            }, 'Join')
          ])
        ]
        break
    }
    elements.forEach(e => this.appendChild(e))
  }

  async fetchInvite () {
    const res = await fetch(`https://discord.com/api/v6/invite/${this.dataset.code}?with_counts=true`)
    if (res.ok) return res.json()
  }
}

customElements.define('discord-invite', DiscordInvite)
