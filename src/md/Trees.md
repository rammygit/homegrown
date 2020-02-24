---
PageTitle: Trees and Traversals 
Date: 12/21/2018
Author: Ramkumar
---

## __Trees and Traversals__

#  Define Rules.

- Set of nodes and edges that connect them. 
- excatly one path between the nodes. 
- Path = connected sequences of edges.
- Edges = connecting nodes 


# ``Rooted Tree`` 

- Every Node has a parent, except Root. 
- One Node can have any number of childern. 

# Definitions 

- Leaf = Node with no children.
- Siblings = Nodes with same parents. 
- Ancestors = nodes on the path from node(d) to root, including node(d) itself. 
- If a is  ancestor of node d, then node d is descendant of node a.
- Length = # of edges in path. 
- Depth of a node = length of path from n to root. 
    - (depth of root is 0 )
- Height of the node = length of path from n to its deepest descendant.
    - Height of any leaf is 0.
    - Height of tree  = Height of the root. 
- SubTree rooted at N : tree formed by n and its descendants.
- Binary Tree 
    - No node has more than 2 children ( > 2)
    - Every Child is either left or right child, even if its the only child.

# Representing Rooted Trees

- one way = item,parent,children stored in a list
- another option = siblings are directly connected. 


<img src="https://i.ibb.co/tpk6wnm/tree1.png" alt="tree1" border="0">


```
class Node{

    Object item;
    Node parent;
    Node firstChild;
    Node nextSibling; // this can become singly linked list
    // nextsibling can keep track so a node can have many //childs. Essentially a singly linked list with first child as head of LL.


}

class Tree {
    Node root;
    int size;
}
```  

# Traversal 

- Visiting the node once. 

### Frequent Traversal

##### Preorder Traversal 


    - Visit each node before recursively visiting its children 
    - Left to Right
    - Root Visited First
    - Visited only once
    - Takes O(N) for entire traversal - Linear Time



```

 class Node {
    public void preorder(){
        this.visit();
        if(firstChild!=null){
            firstChild.preorder();
        }
        if(nextSibiling !=null){
            nextSibling.preorder();
        }
    }
 }

```


  Visualize Preorder Traversal. Order of processing.
       
  ```   
        1
     2     6 
   3 4 5  7 8 
  ```

##### PostOrder Traversal 

- Visit each node children before node itself 
- Left to Right
- Natural way to sum total disk space ( use case )
   - First get the subdirectories then the parent and then entire filesystem 

```
public void postorder(){

    if(firstchild !=null){
        firstChild.postorder();
    }

    this.visit();

    if(nextsibling !=null){
        nextsibling.postorder();
    }

}
```

Visualize

```

         8
      4      7
    1 2 3   5  6

```

- Children gets visited first
- Then the node 
- Finally the root. 



##### InOrder Traversal ( only in Binary Trees )

- Visit the left child 
- then Visit the node itself
- then Visit the Right child.
- Natural for parsing the expression tree.
- O(N) - Linear Time.


Visualize parsing the expression tree.

```
       +
     *   ^
   3  7  4 2 

 ```  

  - `In Order` : 3 * 7 +  4 ^ 2 ( easy for human to read )
  - `Post order`: 37 * 42 ^ + 
  - `Pre Order` : + * 37 ^ 42 (easy for computer )


##### Level order Traversal

- Visit Root, then all depth-1 nodes 
- then depth-2 , ... depth-n 
- so for above expression  => +*^ 3742
- not recursive
- will use queue which initially contains only the root. 
- repeat below steps , until queue is empty.
    - dequeue a node
    - visit that node
    - enqueue the children ( Left to Right )


