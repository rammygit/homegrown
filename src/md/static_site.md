## Static Site - Hand made  

This is a quick hack to recreate what static site generator are doing in a highlevel. My take on this. Built using node.js. This is an opiniated in a good sense. Idea is get up and running within minutes and not to worry about the themes, look & feel and use html and less javascript get your blog site up. 

Primary focus as a user should be writing and go live in seconds. 

Have used `cheerio` library to update the dom.   `fs-extra` is handy library adds few niceties which default node js is missing.  

But this is my dependencies look like. Marked is a good markdown convertor to html. Works goods. Builds fast. 

#### Roadmap

- Understand how the build performance is on high volume. 
- Build speed on huge markdown file. 
- Implement a pagination. 
- Improve markdown code highlighting.

```json
 "dependencies": {
    "cheerio": "^1.0.0-rc.3",
    "fs-extra": "^8.1.0",
    "highlight.js": "^9.15.8",
    "marked": "^0.7.0",
    "pretty": "^2.0.0"
  }

```

### Local Setup 

- Prerequisite have python version 2.7 , for running your local webserver. There are varied options you can chose them, upto your preference. 
- Checkout this project and cd into the project. 
- run `npm start` 
- Above step will create a target `public` folder
- Now cd into `public` folder within this project. 
- Run `python -m SimpleHTTPServer 8000` , this will run a local webserver serving on port 8000. 

### Production Setup 

- Build script is `npm start`
- Deploy directory is `public`
- You should be good to go. 




With Love 
a lazydev