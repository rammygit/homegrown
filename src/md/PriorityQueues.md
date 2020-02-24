# Priority Queues


- Bit like dictionary.
- Entries with key and value. 
- Total order is defined on the keys
- Any key can be inserted at any time. 
- Commonly used as `event queues` , with event time as key. 
- We can implement using BinaryHeap , Sorted List, Unsorted List
- Uses Data structure - Binary Heap 
    - Binary heap is an implementation of Priority Queue.
    - Stored as arrays of entries by level-order traversal.
    - Storing as Array is faster.  

# Operations 

- Identify or remove entry who's key is lowest.
    - Limitation : remove other entries are slow. This makes priority queue fast.
- Insert:
    - 4: first   -> Insert -> 4: first   -> removeMin() -> 4:
      5: second               5: second
                              7: third   

    -  min() - returns 5 


## Binary Heap

- Complete Binary Tree. Every level of tree is full. except possibility of bottom row. 
- Binary Heap can be `Min Heap` or `Max Heap`

- Every Subtree of a Binary heap is a Binary Heap.
    - Bottom row = filled from left to right.


         2
      5     3
    9   6  11 4  
  17 10  8


- Entries will satisfy `heap order` property
    -No child has a key less than parent's key
    - other way to say, Child Key is greater than Parent's key
    - Stored in array using level-order traversal.

  0 1   2   3   4   5   6    7   8    9    10
 |X|2 | 5 | 3 | 9 | 6 | 11 | 4 | 17 | 10 | 8     
  |
  v
 Intentionally left empty.

- Mapping of nodes to Indices : `Level Numbering`.
- How to get to Node i 
    Node i's children are 2i & 2i+1
    Node i's parent is i/2
    
   so from above example, 

   To find info about 9 , whose index is 4. 

   - as per formulae, children are at 2i & 2i +1 = at index 8 & 9 
   which amounts to values 17 & 10. and parent is i/2 = 4/2 = 2 
   Value at index 2 is 5 . parent is 5 

- Binary Tree is used when we remove and insert, tree stays compact.


## Operations

- min()  = return the root. Binary Heap , min value is at the root.

- Insert(Object K,Object v) -> key has to be comparable. 

    - we bubble up after insert.
    - X is the new entry
    - Place X in bottom level at first available slot. If bottom level is full, start new level and fill it from left.
    - New Key might violate the `heap order` property. So let's insert key:2

        2
    5       3
  9    6  11  4
17 10 8 [2]

   - we need to rebalance. 
   - Entry will now bubbles up the tree until the heap order property is satisfied.
   - Repeat:
        - Compare X with its parent key
        - If X is less than parent, swap/exchange.


- Entry RemoveMin()  

  - Remove the entry at the root. Root is always minimum.
  - Before we return , fix the root, as we  rootless.
  - Fill the hole with last entry in the tree. (obviously last entry is not minimum value)
  - We will bubble it down the heap.     
  - Repeat:
     - If X > one or both of is children. Swap X with `minimum child`


  <img src="https://i.ibb.co/M7FjjhX/remove-binary-heap.png" alt="remove-binary-heap" border="0">   


## Comparing for Running Times 


Binary Heap 

- min () = O(1)
- insert() = Bubbles up
    - Worst case = O(log n) , takes O(1) for comparing. has 1+log2n , where n is no.of entries. so it takes O(log n)
    - Best Case = O(1) , if you get lucky.
- removeMin()
    - Worst case = O(log n)
    - Best case = O(1) , if all the items have exactly same key.



Sorted List

- min() = O(1)
- insert() 
    - W.C = O(n) - we can search using binary search in log n but to insert we have to push other items and that is O(n)
    - B.C = O(1)
- removeMin()
    - W.C = O(1)
    - B.C = O(1)


UnSorted List

- min() = O(n) - Linear Time
- insert()
   - W.C = O(1)
   - B.C = O(1)
- removeMin()
   - W.C & B.C = O(n) - Linear Time     


## Bottom Up Heap Construction.

- Given set of entries, make a heap out of it. 
- Insert one by one : O(log n) time.
- How to do in O(n) - Linear Time.
    - Make a complete tree using entries in any order. 
    - Now Fix the broken Tree.
        - Walk Backward from Last internal Node. (node which is not a leaf)
         i.e : Loop backward in array
        - When we visit a node, bubble it down as removeMin()


<img src="https://i.ibb.co/MVJLgnV/bottom-up-heap-construction.png" alt="bottom-up-heap-construction" border="0">        






