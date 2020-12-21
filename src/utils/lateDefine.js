/*
 * Copyright (c) 2020 Cynthia K. Rey
 * Licensed under the Open Software License version 3.0
 */

function lateDefine (str, element, opts) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => customElements.define(str, element, opts))
  } else {
    customElements.define(str, element, opts)
  }
}

export default lateDefine
