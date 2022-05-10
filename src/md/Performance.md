---
PageTitle: Performance Considerations
Date: 04/28/2022
Author: Ramkumar    
---


Use as much of O(1) data structures where possible. Now approach performance tuning in the order how it is listed

1. Don't do it
2. Do it, but don't do it again
3. Do it cheaper
4. Do it less
5. Do it later
6. Do it when they're not looking
7. Do it concurrently

From [Caffeine](https://docs.google.com/presentation/d/1NlDxyXsUG1qlVHMl4vsUUBQfAJ2c2NsFPNPr2qymIBs/edit#slide=id.g833e19c165_1_641)


## Prefetch 

```
<link rel="preload" href="my-js-file.js" as="script" type="text/javascript" />

```

Instead of waiting for the browser to discover these resources itself, we can provide a hint to the browser that it should start working on fetching those resources immediately.



## How ConcurrentHashMap works ? 





