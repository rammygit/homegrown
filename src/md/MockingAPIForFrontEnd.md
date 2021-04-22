---
PageTitle: Mocking REST API
Date: 2017-06-10 10:00 pm
---

Date - 06/10/2017

### JSON-Server

Microservices and Cloud-native development entails you communicating between services via gRPC, REST, GraphQL or can be combination of them. So for REST based communication, front end ends up calling REST APIs. If you want to call a REST based API and work on the returned response to render a page. But it often happens
that you will not have the API ready for your consumption. It will be getting tough to mock the data and have it statically given as source. But then problem with this approach is that when API is ready we end up rewrite the code to consume API data. 

This is something everyone would have faced when working on front end development. This is where 
[JSON-SERVER](https://github.com/typicode/json-server) comes in. 

```json
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}
```

```json
json-server --watch db.json
```

Now if you go to http://localhost:3000/posts/1

```json
{ "id": 1, "title": "json-server", "author": "typicode" }
```

you get the idea right ? 


How to install.

```
npm install -g json-server
```
-g installs this globally so that you can run json-server from any directory. This is bit flexible as you can keep
the json server out of your project structure (if you want to).

I don't want to repeat all the awesome documentation from json-server link mentioned above. Trying to pin point few things of interest.

you can specify an alternate port than the default one. 
````
$ json-server --watch db.json --port 3004

````
You can serve static content ( much like apache or nginx ). Quite handy that this is bundled here. 

````
json-server db.json --static ./some-other-dir
````

You can create dynamic content from js 

```` javascript 1.5
// index.js
module.exports = () => {
  const data = { users: [] }
  // Create 1000 users
  for (let i = 0; i < 1000; i++) {
    data.users.push({ id: i, name: `user${i}` })
  }
  return data
}
````

You can create custom routes, here specify a routes.json with following content.

````json
{
  "/api/": "/",
  "/blog/:resource/:id/show": "/:resource/:id",
  "/blog/:category": "/posts?category=:category"
}
````

start the server with --routes option. This gives the power to adapt to existing api path. 


````
$json-server db.json --routes routes.json
````

Some reference article [here](https://egghead.io/lessons/nodejs-creating-demo-apis-with-json-server) and [here](http://www.betterpixels.co.uk/projects/2015/05/09/mock-up-your-rest-api-with-json-server)


### Few thoughts :

1. As a team when we start developing , if backend developers start with interface definition and API implementation 
gives front end dev team to leverage it and work towards it without much rewrites later in the dev stage. 

2. Front end team trying to consume REST APIs can get some help with JSON-SERVER to start mocking early and a head start.