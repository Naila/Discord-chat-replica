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

class MessageDate extends HTMLElement {
  connectedCallback () {
    if (this.dataset.type === 'date') {
      this.formatDate()
    } else if (this.dataset.type === 'time') {
      const date = new Date(parseInt(this.dataset.timestamp))
      this.innerText = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    } else {
      console.warn(`MessageDate: Cannot parse date: unknown format ${this.dataset.type}`)
    }
  }

  formatDate () {
    const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
    const today = new Date()
    const date = new Date(parseInt(this.dataset.timestamp))
    const daysBetween = (today.getUTCFullYear() - date.getUTCFullYear()) * 365 +
      (today.getUTCMonth() - date.getUTCMonth()) * 30 +
      (today.getUTCDate() - date.getUTCDate())

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    if (daysBetween === 0) {
      this.innerText = `Today at ${hours}:${minutes}`
    } else if (daysBetween === 1) {
      this.innerText = `Yesterday at ${hours}:${minutes}`
    } else if (daysBetween < 7) {
      this.innerText = `Last ${days[date.getDay()]} at ${hours}:${minutes}`
    } else {
      this.innerText = `${date.getDate().toString().padStart(2, '0')}/` +
        `${date.getMonth().toString().padStart(2, '0')}/` +
        `${date.getFullYear().toString()}`
    }
  }
}

customElements.define('message-date', MessageDate)
