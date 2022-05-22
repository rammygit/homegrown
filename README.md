# HomeGrown
Simple static website for my blog with markdown support

This is from an idea that I am missing in current static site generator. Yes they build fast but it comes with so much bells and whistles. 
Intent is to have the end-user checkout and run a command `npm start` ( yes I am using node.js), they should have the blog up and running.

Local developer setup is something that interests me. Current static site generators largely ignore them. 




## How to run the site in your local 

```
npm run local
```

THis command does compile the sass to css. This step is important. So we can pre build this and push it to deployment. So we save the build time and we can also check locally. 

Once you run this command, we will have the site up in your local at **localhost:8000** 


## When you are ready with the site to push. 

I have added hook to netlify and also in parallel to Vercel ( for me to play around ). I have set the environment variable in Netlify for node version as 17.2.0 

I could have added .npm_version or .nvmrc if we want to be part of the code base. I chose to leave it to deploying platform. 

## How to run in production 

Your production script will be 

```
npm start
```

The target folder is **public** 