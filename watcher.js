// watcher.js 
// executing the watcher logic on the file change.
const chokidar = require('chokidar');
const exec = require('child_process').exec;   
const spawn = require('child_process').spawn;   


const runBuild = (file,stats) => {

    const curl = spawn('node', [file_url]);
    // add a 'data' event listener for the spawn instance
    curl.stdout.on('data', function(data) { file.write(data); });
    // add an 'end' event listener to close the writeable stream
    curl.stdout.on('end', function(data) {
      file.end();
      console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
    });
    // when the spawn child process exits, check if there were any errors and close the writeable stream
    curl.on('exit', function(code) {
      if (code != 0) {
        console.log('Failed: ' + code);
      }
    });

}

const watcher = chokidar.watch(['server.js','src'], {
      persistent: true,
      usePolling: true,
      interval: 100, 
      depth: 99
    })
    watcher.on('change', (path, stats) => {
      if (stats) console.log(`File ${path} changed size to ${stats.size}`);
    //   exec(`cp run $`, (error, stdout, stderr) => {
    //     // result dds
    //     console.log(stdout)
    //   });
        runBuild(path,stats)
    })

console.log('watcher started ...')

