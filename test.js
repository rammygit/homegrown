const fsPromises = require('fs').promises;

fsPromises.mkdir('/tmp/mysite_test').catch(console.error)
