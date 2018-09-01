/* 
A Binary Search Tree is a binary tree with the following properties.

"Each node of a Binary Search Tree (BST) stores a piece of data, called the key. Each node has below it a left subtree and a right subtree. The topmost node is called the root and a node with no subtrees is called a leaf. 

The most important property of a BST is that 
for a node with key k, every key in the left subtree is less than k and every key in the right subtree is greater than k."

http://research.cs.queensu.ca/~jstewart/applets/bst/bst-property.html
*/

/* Node
   The node class defines a constructor that
   sets the node's value to the supplied argument
   and sets the left and right child to null.
   
   This class is used by the BinarySearchTree class to
   structure its data, it is not used by the main program
*/
class Node{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

/* BinarySearchTree
   The BinarySearchTree constructor sets the tree's root
   to the node passed into the constuctor. 
*/

class BinarySearchTree{
    constructor(value){
        this.root = new Node(value);
    }
    
    /* insert */
    insert(value){
        // create node from value
        var node = new Node(value);
        // if the tree's root is null, set the root to the new node
        if (this.root == null || this.root.value == null){
            console.log("Root is null");
            this.root = node;
        }
        
        var current = this.root;
        while (current){
            // If tree contains value return
            if (current.value == value){
                return;
            }
            // value is less than current.value
            else if(value < current.value){
                if (current.left == null){
                    current.left = node;
                    return;
                }
                current = current.left;
            }
            // value is greater than current.value
            else{
                if (current.right == null){
                    current.right = node;
                    return;
                }
                current = current.right;
            }
        }
    }
/*End of Class*/    
}
