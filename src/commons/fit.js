/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
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
