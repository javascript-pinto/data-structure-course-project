class Node {
    constructor(value) {
        this.value = value;
        this.children = []; // [null,null];
        // left child: children[0], right child: children[1] 
    }
}

/* BinarySearchTree
   The BinarySearchTree constructor sets the tree's root
   to the value passed into the constuctor. 
*/

class BinarySearchTree {
    constructor(value) {
        this.root = new Node(value);
    }

    /* insert */
    insert(value) {
        // create node from value
        var node = new Node(value);
        // if the tree's root is null, set the root to the new node
        if (this.root == null || this.root.value == null) {
            console.log("Root is null");
            this.root = node;
        }

        var current = this.root;
        while (current) {
            console.log(value);
            // If tree contains value return
            if (current.value == value) {
                return;
            }
            // value is less than current.value
            else if (value < current.value) {
                console.log("value, current.value",value, current.value)
                
                if (current.children[0] == null || current.children[0].value == "e") {
                    current.children[0] = node;
                    if (current.children[1]==null){
                        current.children[1] = new Node("e");
                    }
                    return;
                }
                // current = current.left;
                current = current.children[0];
            }
            // value is greater than current.value
            else {
                if (current.children[1] == null || current.children[1].value == "e") {
                    // if (current.children[1] == null ){
                    if (!current.children[0]) {
                        current.children[0] = new Node("e");
                    }
                    current.children[1] = node;
                    return;
                }
                current = current.children[1];
            }
        }
    }
    /*End of Class*/
}

// Draw Tree
function drawTree(data) {
    // Set dimensions and margins for diagram
    var margin = {
            top: 80,
            bottom: 80
        },
        width = 800,
        height = 600 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin   
    var svg = d3.select("body").append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox","0 0 800 600")
        .append("g")
        .attr("transform", "translate(0," + margin.top + ")");

    var i = 0,
        duration = 750,
        root;

    // Declares a tree layout and assigns the size
    var treemap = d3.tree().size([width, height]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(data, function(d) {
        return d.children;
    });

    root.x0 = width / 2;
    root.y0 = 0;

    // Collapse after the second level
    // root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
        if (d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null;
        }
    }

    // Update
    function update(source) {
        // Assigns the x and y position for the nodes
        var treeData = treemap(root);

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        // Normalize for fixed-depth
        nodes.forEach(function(d) {
            d.y = d.depth * 100
        });

        // **************** Nodes Section ****************

        // Update the nodes...
        var node = svg.selectAll('g.node')
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on('click', click);

        // Add Circle for the nodes

        nodeEnter.append('circle')
            .attr('class', function(d) {
                if (isNaN(d.value)) {
                    return "node hidden";
                }
                return 'node';
            })
            .attr('r', 1e-6)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                if (isNaN(d.value)) {
                    return "";
                }
                return d.data.value;
            });

        // Update
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the nodes
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr('cursor', 'pointer');

        // Remove any exiting nodes
        nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 1e-6);

        // On exit reduce the opacity of text lables  
        nodeExit.select('text')
            .style('fill-opacity', 1e-6)

        // **************** Links Section ****************

        // Update the links...
        var link = svg.selectAll('path.link')
            .data(links, function(d) {
                return d.id;
            });

        // Enter any new links at the parent's previous position
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", function(d) {
                if (isNaN(d.value)) {
                    return "link hidden "
                }
                return "link";
            })

            .attr('d', function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal(o, o);
            });

        // Update
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d) {
                return diagonal(d, d.parent)
            });

        // Remove any existing links
        var linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Create a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            path = `M ${s.x} ${s.y}
        C ${(s.x + d.x) / 2} ${s.y},
          ${(s.x + d.x) / 2} ${d.y},
          ${d.x} ${d.y}`

            return path;
        }

        // Toggle children on click
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }
}

window.onload = function() {
    var tree = new BinarySearchTree(50);
    var numbers = [18,36,60,45,37];

    for (var i = 0; i < numbers.length; i++) {
        tree.insert(numbers[i]);
    }
    // Call Draw Tree and pass it tree.root
    console.log(tree.root);
    drawTree(tree.root);
};
// 
// // showMessages
// // delayed loop to show messages
function drawSteps(numbers){
  if (++steps == 5){
    return;
  }
  
  var tree = new BinarySearchTree(25);
  var numbers = [33,87,45,56,2,5,100];
  for (var i = 0; i <steps; i++) {
      tree.insert(numbers[i]);
  }
  drawTree(tree.root);

  window.setTimeout(drawSteps, 500);
}