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

export default class MessageDate extends HTMLElement {
  connectedCallback () {
    const type = this.getAttribute('type')
    if (type === 'date') {
      this.formatDate()
    } else if (type === 'time') {

    } else {
      console.warn(`MessageDate: Cannot parse date: unknown format ${type}`)
    }
  }

  formatDate () {
    const days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
    const today = new Date()
    const date = new Date(parseInt(this.getAttribute('timestamp')))
    const daysBetween = (today.getUTCFullYear() - date.getUTCFullYear()) * 365 +
      (today.getUTCMonth() - date.getUTCMonth()) * 30 +
      (today.getUTCDate() - date.getUTCDate())
    if (daysBetween === 0) {
      this.innerText = `Today at ${date.getUTCHours()}:${date.getUTCMinutes()}`
    } else if (daysBetween === 1) {
      this.innerText = `Yesterday at ${date.getUTCHours()}:${date.getUTCMinutes()}`
    } else if (daysBetween < 7) {
      this.innerText = `Last ${days[date.getUTCDay() - 1]} at ${date.getUTCHours()}:${date.getUTCMinutes()}`
    } else {
      this.innerText = `${date.getUTCDay().toString().padStart(2, '0')}/` +
        `${date.getUTCMonth().toString().padStart(2, '0')}/` +
        `${date.getUTCFullYear().toString().padStart(2, '0')}`
    }
  }
}

customElements.define('message-date', MessageDate)
