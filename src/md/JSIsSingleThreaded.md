
---
PageTitle: JS is not multi-threaded
Date: 06/04/2021
Author: Ramkumar
---

I came across a conversation to my question why Browsers are single threaded. To which one responded [Flow is trying to do multi-threaded browser](https://www.ekioh.com/flow-browser/) but then what followed was something of an interesting convo which I thought I want to record it here for my reference later to read few blogs referred here later on. 

You can view this entire [conversation here](https://news.ycombinator.com/item?id=27388691)



This wonderful discussion and with many references are something of a joy for me to read and learn. 



**Person 1(livre)** - Saying that JavaScript is single threaded isn't accurate anymore. Even the article we just read mentions that you can run multiple threads with WebWorkers

**Person 2(dmitriid)** -  This doesn't make Javascript multithreaded. It means you run single-threaded programs in separate containers and pass messages between them.

**Person 1(livre)** - If you mean multithreaded as running separate OS threads I've got to agree with you but the definition of thread isn't limited to just that. I don't know about the internals of web browsers or whether they use OS threads or green threads or a combination of both for web workers but they are threads and that's how the MDN calls them too: [MDN Mozilla Reference](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

**Person 2(dmitriid)** -  `and that's how the MDN calls them too` 
These are the browser's background threads, maybe. They don't make Javascript multithreaded or even Javascript runtimes multithreaded.
More here: https://news.ycombinator.com/item?id=27397555

**Person 1(livre)** - I'm not sure I get your point. It's more or less what I said, it isn't using real OS threads but it is doing something similar to green threads. It isn't true multithreading in the sense that it doesn't spawn an OS thread but it spawns lightweight (or green or simulated) threads with their own VM.



**Person 2(dmitriid)** -  `It's more or less what I said, it isn't using real OS threads but it is doing something similar to green threads.`
It's not even green threads.
Also, literally on the page you linked:
=== start quote ===
The Worker interface spawns real OS-level threads,
=== end quote ===
[1]
`it doesn't spawn an OS thread but it spawns lightweight (or green or simulated) threads with their own VM.`
It spawns an isolated process. Javascript as a language and its runtime cannot support threads. To do "threads" they basically initialise a new instance of JS runtime.
This is not "threading" by any definition. MDN page may call that for the sake of people who end up using it, but these are not: - threads - green threads - lightweight
If in doubt, you could try and find any implementation of a thread or a worker in the JS VM: https://github.com/mozilla/gecko-dev/tree/master/js/src/vm
It's not there, because workers are implemented at the DOM level, in the browser: https://github.com/mozilla/gecko-dev/tree/master/dom/workers
It's an outside implementation, running processes inside the host, and letting processes communicate using memory-mapped values. 20 years ago no one in their right mind would call this "multithreading in language X". It was "app 1 written in any language is communicating with app 2 written in any language via memory-mapped files". Now people who've never seen anything outside web development call it multithreading.
[1] Fun trivia: original implementation literally used a runtime per worker: https://blog.mozilla.org/luke/2012/01/24/jsruntime-is-now-of... It still uses a CycleCollectedJSRuntime per worker, but I'm too lazy to dig through source code for further details.


This last section is something of interest for me personally - with blog titled JS is officially single-threaded :) It is a good read 


