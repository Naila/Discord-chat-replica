function collectAst (ast, output = []) {
  if (Array.isArray(ast)) {
    ast.forEach(node => collectAst(node, output))
  } else if (typeof ast.content === 'string') {
    output.push(ast.content)
  } else if (ast.content != null) {
    collectAst(ast.content, output)
  }
  return output
}

function flattenAst (ast, parentAst = null) {
  // Walk the AST.
  if (Array.isArray(ast)) {
    const astLength = ast.length
    for (let i = 0; i < astLength; i++) {
      ast[i] = flattenAst(ast[i], parentAst)
    }
    return ast
  }

  // And more walking...
  if (ast.content != null) {
    ast.content = flattenAst(ast.content, ast)
  }

  // Flatten the AST if the parent is the same as the current node type, we can just consume the content.
  if (parentAst != null && ast.type === parentAst.type) {
    return ast.content
  }

  return ast
}

const limitReached = Symbol('ast.limit')
function constrainAst (ast, state = { limit: 200 }) {
  if (ast.type !== 'text') {
    state.limit -= 1
    if (state.limit <= 0) {
      return limitReached
    }
  }

  if (Array.isArray(ast)) {
    const astLength = ast.length
    for (let i = 0; i < astLength; i++) {
      const newNode = constrainAst(ast[i], state)
      if (newNode === limitReached) {
        ast.length = i
        break
      }
      ast[i] = newNode
    }
  }

  return ast
}

function astToString (ast) {
  return collectAst(ast).join('')
}

module.exports = { astToString, flattenAst, constrainAst }
