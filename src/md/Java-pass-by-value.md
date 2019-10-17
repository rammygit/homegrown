---
PageTitle: What is Pass by Value in Java ?
Date: 10/01/2019
Author: Ramkumar
---
In Java everything is passed by value when you call a method. What does this mean is, when a method is called all its parameters are made a exact copy of the original and placed in the call stack and newly copied parameters are passed to the method.

Life of these copied parameters are until the method is run. After which their life ends. 

There is a difference in the pass by value between the primitives and reference. 

```
import java.util.HashMap;
import java.util.Map;

/**
 * Demo test class to understand pass by value in the method call. 
 * 
 * 
 */
public class Hello {


    public static void main(String args[]) {

        Map<String,String> map = new HashMap<>();

        map.put("A", "A1");

        int a = 1;
        int b = 2;

        updateReference(map);

        updatePrimitive(a,b);

/* this will print 1,2 as the original values will not be changed */
        print("int values => "+a+","+b);

		// this will print A,A1 & B, B1
		/* map is a reference and copied parameters point to  the same reference in the heap */
        map.forEach((k,v) ->{
            print("map values => "+k+","+v);

        });
    
    }



    static void print(String msg){
        System.out.println(msg);
    }


    /**
     * This will update the map.
     * All method calling in java are pass by value which means exact copy of the reference is created and placed in the stack. 
     * newly created copy of reference will still point to the reference in the heap. 
     * 
     * so any changes to the ref copy, will change the original reference. 
     * 
     * but if the ref copy is assigned a new reference in heap, changes will not reflect in the original reference. 
     * 
     * 
     * 
     * @param inMap
     */
    public static void updateReference(Map<String,String> inMap){

        if(inMap!=null){

            inMap.put("B", "B1");

        }

    }


    /**
     * Pass by value for primitives in java creates an exact copy of the value.
     * so any changes to the passed value will not change the original primitive value. 
     * 
     * 
     * @param a
     * @param b
     */
    public static void updatePrimitive(int a, int b){

        a++;
        b++;


    }

}



```

Run this code and you will the difference.  Comments in the code says what  will be the expected output. 

