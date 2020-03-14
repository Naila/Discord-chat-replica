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

module.exports = (width, height, maxWidth, maxHeight) => {
  if (width !== maxWidth || height !== maxHeight) {
    const widthRatio = width > maxWidth ? maxWidth / width : 1
    width = Math.max(Math.round(width * widthRatio), 0)
    height = Math.max(Math.round(height * widthRatio), 0)

    const heightRatio = height > maxHeight ? maxHeight / height : 1
    width = Math.max(Math.round(width * heightRatio), 0)
    height = Math.max(Math.round(height * heightRatio), 0)
  }

  return {
    width,
    height
  }
}
