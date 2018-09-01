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

    } else if (node.value < root.value) {
      // check if left subtree is null
      if (root.left != null) {
        this.insert(node, root.left)
      } else {
        root.left = node
        node.parent = root
      }
    } else {
      // check if right subtree is null
      if (root.right != null) {
        this.insert(node, root.right)
      } else {
        root.right = node
        node.parent = root
      }
    }
  }
}

function myXOR (a, b) {
  return (a || b) && !(a && b)
}

// Update
function update (source) {
  // Assigns the x and y position for the nodes
  var treeData = treemap(root)

  // Compute the new tree layout.
  var nodes = treeData.descendants()
  var links = treeData.descendants().slice(1)

  // Normalize for fixed-depth
  nodes.forEach(function (d) {
    d.y = d.depth * 100
  })

  // **************** Nodes Section ****************

  // Update the nodes...
  var node = svg.selectAll('g.node')
    .data(nodes, function (d) {
      return d.id || (d.id = ++i)
    })

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      return 'translate(' + source.x0 + ',' + source.y0 + ')'
    })
    .on('click', click)

  // Add Circle for the nodes
  nodeEnter.append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style('fill', function (d) {
      return d._children ? 'lightsteelblue' : '#fff'
    })

  // Add labels for the nodes
  nodeEnter.append('text')
    .attr('dy', '.35em')
    .attr('x', function (d) {
      return d.children || d._children ? -13 : 13
    })
    .attr('text-anchor', function (d) {
      return d.children || d._children ? 'end' : 'start'
    })
    .text(function (d) {
      return d.data.value
    })

  // Update
  var nodeUpdate = nodeEnter.merge(node)

  // Transition to the proper position for the nodes
  nodeUpdate.transition()
    .duration(duration)
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style('fill', function (d) {
      return d._children ? 'lightsteelblue' : '#fff'
    })
    .attr('cursor', 'pointer')

  // Remove any exiting nodes
  nodeExit = node.exit().transition()
    .duration(duration)
    .attr('transform', function (d) {
      return 'translate(' + source.x + ',' + source.y + ')'
    })
    .remove()

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6)

  // On exit reduce the opacity of text lables
  nodeExit.select('text')
    .style('fill-opacity', 1e-6)

  // **************** Links Section ****************

  // Update the links...
  var link = svg.selectAll('path.link')
    .data(links, function (d) {
      return d.id
    })

  // Enter any new links at the parent's previous position
  var linkEnter = link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function (d) {
      var o = {
        x: source.x0,
        y: source.y0
      }
      return diagonal(o, o)
    })

  // Update
  var linkUpdate = linkEnter.merge(link)

  // Transition back to the parent element position
  linkUpdate.transition()
    .duration(duration)
    .attr('d', function (d) {
      return diagonal(d, d.parent)
    })

  // Remove any existing links
  var linkExit = link.exit().transition()
    .duration(duration)
    .attr('d', function (d) {
      var o = {
        x: source.x,
        y: source.y
      }
    })
    .remove()

  // Store the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x
    d.y0 = d.y
  })

  // Create a curved (diagonal) path from parent to the child nodes
  function diagonal (s, d) {
    path = `M ${s.x} ${s.y}
    C ${(s.x + d.x) / 2} ${s.y},
    ${(s.x + d.x) / 2} ${d.y},
    ${d.x} ${d.y}`

    return path
  }

  // Toggle children on click
  function click (d) {
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
    update(d)
  }
}