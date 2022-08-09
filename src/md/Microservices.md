---
PageTitle: Decomposing a Monolith
Date: 10/01/2020
Author: Ramkumar
---


Why to decompose a monolith ? Initial thoughts are scalability, ease of growing individual services, adopting to business needs. But I see decomposing monolith brings about concept of lean practices to fore. It aligns well with agile methodology. Faster release, ease of rollback, testability, independence, need not conform etc.

Decomposing monolith starts with understanding few interesting ideas that helps us in decomposing. It starts with thinking business as series of events. Everything is an event like shipping an order, accepting an order etc. You start to [Thinking in Events](https://martin.kleppmann.com/papers/debs21-keynote.pdf)

Second Idea I see is containerizing the apps. [why should you be using Docker](https://www.freecodecamp.org/news/what-is-docker-used-for-a-docker-container-tutorial-for-beginners/) is something every developer should ask and pursue the route of container world. Docker made this famous and now we have many providers. 


## Moving away from Stored Procedures

Heavily debated topic and there is no winner. I personally don't prefer stored procedures. I have worked few different systems and all had issues maintaining stored procedures in long run. They evolve to have business logic in them. This has so many problems in different levels. 

- Having business logic in Stored Procs are hard to maintain and evolve. 
- Poor in code documentation when you write stored procedures
- Becomes harder to scale horizontally
- Single point of contention or failure 
- SQL is good express simple business conditions but poor to implement complex ones
- Vendor lock in , hard to port 
- Needs vendor specific optimizations. It is not universal. 
- Query plan is something doesn't work the same way in all the environments. It is subject to change based on the input data. Performance optimizations are more of trial and error
- Need constant attention and enforcing code quality checks are hard to impossible
- Code reviews are a pain. 
- Poor Testability 
- Not lean. It grows in cognitive complexity so easily
- Poor Error handling
- Versioning is hard
- They are good for interactive use cases. Like filtering, paginations


So do Stored Procedures have their place in 2021 ? I don't see many favoring it, but stored procedures are good for mass manipulation of data. There are use cases where keeping the logic closer to data makes more sense than to move it away from it.  T-SQL is about interaction with data. How you store and read it. How you change it. Application layer knows better understands what it needs to do with the data. 


## Domain Driven Design 

Domain is what you are writing program for. Subject area you trying to solve. Figure out of domain, ....


## Characteristics of Microservice

- runs in isolation
- has a Bounded Context
- has a decentralized data storage
- embraces Evolution

## Challenges 

- Distributed Transactions
- Point-to-Point mess
- Performance


## Caching

For Caching - Look at the [performance consideration](https://staticfire.site/content/performance/) article I wrote 


## Data Challenges

- Veracity
    - Data Management
    - Data Reliability 
- Variety
    - Various data structures
    - Structured, UnStructured, Semi-Structured
- Volume
- Velocity
    - Real Time Data Analytics
    - Integrating Data Streams 

So what are the patterns we have in Data Integration

## Traditional Data Integration

Source -> ETL -- (batched ) --> Data Warehouse 


## Advantages with Microservice Architectures

- Speed to Market
- 


## Problems with Microservices

> Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of    the organization’s communication structure. — Melvin E. Conway

Many advocate Microservices should treat its API as public facing. This way they have independence. But you cannot introduce breaking changes and need to document your API properly.

> The monoliths are good to start with as they help the team in learning about the new domain and nature of business however they are required to be re-structured if quick turnaround is expected for new features.



