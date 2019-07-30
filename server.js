// const md = require('')


const fsPromises = require('fs').promises;

const fsExtra = require('fs-extra')

// const path = require('path')

const cheerio = require('cheerio')

// const pretty = require('pretty')

const property = require('./strings.json');

const processContent  = require('./build/util');
const  paginate  = require('./build/pagination');


// const FILE_IGNORE = ['.gitignore','server.js','server_new.js','package-lock.json','package.json']

// const PROJECT_PATH = '/Users/ram/Documents/projects/html5-boilerplate_v7.2.0/' 
const PROJECT_PATH = __dirname+'/'

const TARGET_DIR = `${PROJECT_PATH}public`

const TEMP_DIR = '/tmp/mysite'

const DIRECTORY_IGNORE = [`${PROJECT_PATH}node_modules`,`${PROJECT_PATH}.git`,`${PROJECT_PATH}build`]






  
//start here 
//add try catch
const start = async function () {

    console.log(`author printing => ${property.blogTitle}`)
    // const exists = await fs.pathExists('/tmp/mysite')
    //if(exists)
    fsExtra.removeSync(TEMP_DIR)
    //delete the existing target dir. Need to find out performant way to figure this. 
    fsExtra.removeSync(TARGET_DIR)

    
    //fsPromises.mkdir(TARGET_DIR).catch(console.error)
    //fsPromises.mkdir('/tmp/mysite').catch(console.error)

    await fsExtra.ensureDir(TEMP_DIR,{
        mode: 0o2775
      }) 
    
    await fsExtra.ensureDir(TARGET_DIR,{
        mode: 0o2775
      })



    const filterFunc = (src, dest) => {
        // your logic here
        // it will be copied if return true
        //console.log(`src => ${src}`)
        if(DIRECTORY_IGNORE.includes(src)){
            // if it is not in the ignore directory,  
            //console.log('return false ')
            return false
        }
        //console.log('return true')
        // true will make sure file copy happens. 
        return true

      }

    
      // async 
    fsExtra.copySync(PROJECT_PATH, TEMP_DIR, {overwrite:true,filter: filterFunc})
    
    console.log('success copying files to temp directory')

    await fsExtra.move(TEMP_DIR,`${TARGET_DIR}`,{ overwrite: true })

    // delete the unneeded md directory
    await fsExtra.remove(`${TARGET_DIR}/md`)
    // remove the md folder 
    
    const mainIndexFileContent = await fsPromises.readFile(PROJECT_PATH+'index.html',{encoding:'utf-8'})
    //load the main index file for manipulation. 
    const $= cheerio.load(mainIndexFileContent)

    // let htmls = await readDirectory(PROJECT_PATH+'md/')
    let htmls = await processContent(`${PROJECT_PATH}md/`,TARGET_DIR)
  
    // this will add pagination pbased on the strings.json file where postPerPage is used.
    await paginate($,property,htmls,TARGET_DIR)
}


start()


 
 
    