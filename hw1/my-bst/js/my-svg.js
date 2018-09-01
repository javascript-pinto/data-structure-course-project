var numbers = [7, 8, 15, 20]

var node = new Node(10)
var tree = new BinarySearchTree(node)

for (i in numbers) {
  tree.insert(new Node(numbers[i]), tree.root)
}

// Set dimensions and margins for diagram
var margin = {
  top: 80,
  bottom: 80
}

var width = 800
var height = 600 - margin.top - margin.bottom

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select('#my-bst').append('svg')
  .attr('width', '100%')
  .attr('height', height + margin.top + margin.bottom)
  .attr('viewBox', '0 0 800 600')
  .append('g')
  .attr('transform', 'translate(0,' + margin.top + ')')

var i = 0
var duration = 750
var root

// Declares a tree layout and assigns the size
var treemap = d3.tree().size([width, height])

// Assigns parent, children, height, depth, and coordinates
root = d3.hierarchy(tree.root, function (d) {
  d.children = []
  if (d.left) {
    d.children.push(d.left)
    if (myXOR(d.left, d.right)) {
      d.children.push(new Node('e'))
    }
  }
  if (d.right) {
    if (myXOR(d.left, d.right)) {
      d.children.push(new Node('e'))
    }
    d.children.push(d.right)
  }
  return d.children
})

root.x0 = width / 2
root.y0 = 0

// Collapse after the second level
// root.children.forEach(collapse);

// Collapse the node and all it's children
function collapse (d) {
  if (d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

$(update(root))
