//server.js
// change test dddd dd
const fsPromises = require('fs').promises;
const fsExtra = require('fs-extra')
const cheerio = require('cheerio')
const property = require('./config.json');
const processContent  = require('./src/build/util');
const {paginate,writeHTMLs} = require('./src/build/pagination');
const spawn = require('child_process').spawn; 

const PROJECT_PATH = __dirname+'/src'
// const TARGET_DIR = `${PROJECT_PATH}/public`
const TARGET_DIR = `${__dirname}/public`
// const TEMP_DIR = '/tmp/mysite'
const DIRECTORY_IGNORE = [`${PROJECT_PATH}/node_modules`,
                          `${PROJECT_PATH}/.git`,
                          `${PROJECT_PATH}/build`,
                          `${PROJECT_PATH}/sass`,
                          `${PROJECT_PATH}/public`]

                          
const PORT = process.env.PORT || 3000;
const doWatch = process.env.watch || true
//const production = process.env.

const yargs = require('yargs');

const argv = yargs
    .command('production', 'Tells whether it is prod or dev', {
        
    })
    .command('dev','for local development',{

    })
    .help()
    .alias('help', 'h')
    .argv;



//start here 
//add try catch
const start = async _ => {

    //delete the existing target dir. Need to find out performant way to figure this. 
    fsExtra.removeSync(TARGET_DIR)
    
    await fsExtra.ensureDir(TARGET_DIR,{
        mode: 0o2775
      })



    const filterFunc = (src, dest) => {
        // your logic here
        // it will be copied if return true
        if(DIRECTORY_IGNORE.includes(src)){
            // if it is not in the ignore directory,  
            //console.log('return false ')
            return false
        }

        // true will make sure file copy happens. 
        return true

      }
    
    fsExtra.copySync(PROJECT_PATH, TARGET_DIR, {overwrite:true,filter: filterFunc})
    
    console.log('success copying files to target directory')

    // await fsExtra.move(TEMP_DIR,`${TARGET_DIR}`,{ overwrite: true })

    // delete the unneeded md directory
    await fsExtra.remove(`${TARGET_DIR}/md`)

    console.log('removed md dir in target')
    // remove the md folder 
    
    const mainIndexFileContent = await fsPromises.readFile(`${PROJECT_PATH}/index.html`,{encoding:'utf-8'})
    //load the main index file for manipulation. 
    const $= cheerio.load(mainIndexFileContent)

    // let htmls = await readDirectory(PROJECT_PATH+'md/')
    //calls in util.js
    let htmlsObject = await processContent(`${PROJECT_PATH}/md/`,TARGET_DIR,PROJECT_PATH,property)
  
    htmlsObject.sort((a, b) => new Date(b.contentDate) - new Date(a.contentDate))

    console.log(`html object = ${JSON.stringify(htmlsObject,null, 2)}`)

    // this will add pagination pbased on the strings.json file where postPerPage is used.
    const paginatedHTMLs = await paginate($,property,htmlsObject,TARGET_DIR)


    await writeHTMLs(paginatedHTMLs,TARGET_DIR)

}

 
/**
 * starts the local server for you. 
 * expects the python to be available in the path.
 * change to any local server you want to spin up. Feel free to do so.
 * if you are mac don't worry about. 
 * Btw this looks for python 2.7  
 */
const startServer = _ => {
  console.log('after the process complete , started local server for dev')

  const process = spawn('python', ['-m','SimpleHTTPServer','8000'],{cwd:'./public'});
  
  process.stdout.on('data',  (data) => {
      console.log('stdout: ' + data);
  });

  // process.stderr.on('data',  (data) => {
  //     console.log('stderr: ' + data);
  // });

  // process.on("")

  process.on('close',  (code) => {
      console.log('Child process exit with code: ' + code);
  });

  process.on('error',  (code) => {
    console.error('Child process error with code: ',code);
  });
}



const is_dev = () => {
  return argv._.includes('dev')
}




/**
 * start here 
 */
start().then(()=>{


  // start local python based server
  if(is_dev()){

    startServer()
  }
  
  

});







 
 
    