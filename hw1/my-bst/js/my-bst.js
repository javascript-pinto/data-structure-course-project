class Node {
  constructor (value) {
    this.value = value
    this.parent = null
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor (node) {
    this.root = node
  }

  // Insert Node
  insert (node, root) {
    if (node.value === root.value) {
      alert('Node exists.')
      return false
    } else if (node.value < root.value) {
      if (root.left != null) {
        this.insert(node, root.left)
      } else {
        root.left = node
        node.parent = root
      }
    } else {
      if (root.right != null) {
        this.insert(node, root.right)
      } else {
        root.right = node
        node.parent = root
      }
    }
    return true
  }

  remove (key, root) {
    // Find node to delete.
    if (root !== null) {
      var current = root
      var stack = []

      while (current) {
        stack.push(current)

        if (current.value === key) {
          // Found the node to delete.
          stack.pop()
          var parent = stack.pop()

          if (!current.left && !current.right) {
            // No children, just remove the node.
            if (parent && parent.left && parent.left.value === current.value) {
              parent.left = null
            } else if (parent) {
              parent.right = null
            } else {
              // No parent, this must be the root node.
              root = []
            }
          } else if (current.left && !current.right) {
            // One left child node.
            if (parent && parent.left && parent.left.value === current.value) {
              parent.left = current.left
            } else if (parent) {
              parent.right = current.left
            } else {
              // No parent, this must be the root node.
              root = current.left
            }
          } else if (current.right && !current.left) {
            // One right child node.
            if (parent && parent.left && parent.left.value === current.value) {
              parent.left = current.right
            } else if (parent) {
              parent.right = current.right
            } else {
              // No parent, this must be the root node.
              root = current.right
            }
          } else {
            // Node has 2 children.
            // First, find the minimum element in the right subtree of the node to be removed.
            var minNode = current.right
            while (minNode) {
              if (minNode.left) {
                minNode = minNode.left
              } else {
                // We're at the bottom of the subtree.
                break
              }
            }

            // Delete minNode.
            current = this.remove(current, minNode.value)

            // Replace value.
            current.value = minNode.value
          }
          break
        } else if (key < current.value) {
          current = current.left
        } else if (key > current.value) {
          current = current.right
        }
      }
    }

    return root
  }

}

function myXOR (a, b) {
  return (a || b) && !(a && b)
}
