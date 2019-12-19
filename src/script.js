/**
 * Small microservice to generate a Discord-like chat section
 * Copyright (C) 2019-present Bowser65
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

// Utils
const textarea = document.getElementById('clipboard')
const toast = document.getElementById('toast')
const modal = document.getElementById('modal')

function copy (text, label = 'ID copied to clipboard.') {
  textarea.style.display = 'block'
  toast.querySelector('span').innerText = label
  toast.classList.add('opened')
  textarea.value = text
  textarea.select()
  document.execCommand('copy')
  textarea.style.display = 'none'
  setTimeout(() => toast.classList.remove('opened'), 2500)
}

function openModal (type) {
  modal.querySelector(`#${type}`).style.display = null
  modal.classList.add('opened')
}

function closeModal () {
  modal.classList.remove('opened')
  modal.classList.add('closing')
  setTimeout(() => {
    modal.classList.remove('closing')
    modal.querySelectorAll('> div').forEach(el => (el.style.display = 'none'))
  }, 200)
}

modal.addEventListener('click', closeModal)

// Light theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  if (document.body.className.includes('dark')) {
    document.body.classList.remove('theme-dark')
    document.body.classList.add('theme-light')
  } else {
    document.body.classList.remove('theme-light')
    document.body.classList.add('theme-dark')
  }
})

// Timestamps
document.querySelectorAll('[data-timestamp]').forEach(el => {
  const days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
  const today = new Date()
  const date = new Date(parseInt(el.dataset.timestamp))
  const daysBetween = (today.getUTCFullYear() - date.getUTCFullYear()) * 365 +
    (today.getUTCMonth() - date.getUTCMonth()) * 30 +
    (today.getUTCDate() - date.getUTCDate())
  const timeEl = el.querySelector('.time')
  const effectiveEl = timeEl || el
  if (daysBetween === 0) {
    effectiveEl.innerText = `Today at ${date.getUTCHours()}:${date.getUTCMinutes()}`
  } else if (daysBetween === 1) {
    effectiveEl.innerText = `Yesterday at ${date.getUTCHours()}:${date.getUTCMinutes()}`
  } else if (daysBetween < 7) {
    effectiveEl.innerText = `Last ${days[date.getUTCDay() - 1]} at ${date.getUTCHours()}:${date.getUTCMinutes()}`
  } else {
    effectiveEl.innerText = `${date.getUTCDay().toString().padStart(2, '0')}/` +
      `${date.getUTCMonth().toString().padStart(2, '0')}/` +
      `${date.getUTCFullYear().toString().padStart(2, '0')}`
  }
})

// Code blocks
document.querySelectorAll('.codeblock').forEach(cb => {
  cb.querySelector('.copy').addEventListener('click', () => {
    copy(cb.querySelector('.shitcode').innerText, 'Shitcode copied to clipboard.')
  })
})

// Copy ID (@todo: make it be popout)
document.querySelectorAll('[data-author-id]').forEach(el => {
  el.querySelector('.name').addEventListener('click', () => copy(el.dataset.id))
  el.querySelector('.avatar').addEventListener('click', () => copy(el.dataset.id))
})

// Enlarge
const enlarge = document.getElementById('enlarge')
enlarge.querySelector('img').addEventListener('click', e => e.stopPropagation())
document.querySelectorAll('[data-enlargable]').forEach(el => {
  el.addEventListener('click', () => {
    enlarge.querySelector('img').src = el.src
    enlarge.querySelector('a').href = el.src
    openModal('enlarge')
  })
})

// FF
if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
  document.body.classList.add('firefox')
}

if (navigator.userAgent.toLowerCase().indexOf('chrome') !== -1) {
  document.body.classList.add('chrome')
}
