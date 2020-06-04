/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

import { createTooltip } from '../utils'

class MessageDate extends HTMLElement {
  connectedCallback () {
    const date = new Date(parseInt(this.dataset.timestamp))
    if (this.dataset.type !== 'full') {
      createTooltip(this, new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date), this.dataset.type === 'time' ? 'right' : 'top')
    }

    if (this.dataset.type === 'date') {
      this.innerText = MessageDate.formatDate(date)
    } else if (this.dataset.type === 'time') {
      this.innerText = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else if (this.dataset.type === 'full') {
      this.innerText = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date)
    } else {
      console.warn(`MessageDate: Cannot parse date: unknown format ${this.dataset.type}`)
    }
  }

  static formatDate (date) {
    const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
    const today = new Date()
    const daysBetween = (today.getUTCFullYear() - date.getUTCFullYear()) * 365 +
      (today.getUTCMonth() - date.getUTCMonth()) * 30 +
      (today.getUTCDate() - date.getUTCDate())

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    if (daysBetween === 0) {
      return `Today at ${hours}:${minutes}`
    } else if (daysBetween === 1) {
      return `Yesterday at ${hours}:${minutes}`
    } else if (daysBetween < 7) {
      return `Last ${days[date.getDay()]} at ${hours}:${minutes}`
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/` +
        `${date.getMonth().toString().padStart(2, '0')}/` +
        `${date.getFullYear().toString()}`
    }
  }
}

customElements.define('message-date', MessageDate)
export default MessageDate
