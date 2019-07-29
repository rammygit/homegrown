// const md = require('')
const marked = require('marked');

const fsPromises = require('fs').promises;

const fsExtra = require('fs-extra')

const path = require('path')

const cheerio = require('cheerio')

const pretty = require('pretty')

const property = require('./strings.json');



const FILE_IGNORE = ['.gitignore','server.js','server_new.js','package-lock.json','package.json']

// const PROJECT_PATH = '/Users/ram/Documents/projects/html5-boilerplate_v7.2.0/' 
const PROJECT_PATH = __dirname+'/'

const TARGET_DIR = `${PROJECT_PATH}public`

const TEMP_DIR = '/tmp/mysite'

const DIRECTORY_IGNORE = [`${PROJECT_PATH}node_modules`,`${PROJECT_PATH}.git`]



// Set options
// `highlight` example uses `highlight.js`
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });


  const readDirectory = async function (basePath) {

    let appendHTMLs = []
    //console.log('printing the base path at the start => ',basePath)

    

    const dirArr = await fsPromises.readdir(basePath, { withFileTypes: true })

    // console.log('dirArr => ',dirArr)
    for (const dirent of dirArr) {

        const file_ext = path.extname(dirent.name)
        const stat = await fsPromises.lstat(basePath+dirent.name);

        // console.log(" file list   => ", dirent)
        //  console.log('dirent stat =  is file  =>', stat.isFile())
        if (stat.isFile()) {
           // console.log(' it is a file => ', dirent.name)
            if (file_ext === '.html' || file_ext === '.js' || file_ext === '.css' || file_ext === '.md') {
                if(FILE_IGNORE.indexOf (dirent.name ) == -1) {
                    //console.log('reading the file => ',dirent.name)
                    let appendHTML = await process(basePath, dirent)
                    appendHTMLs.push(appendHTML)
                } 
            } 
        } else {
            // console.log('reading the child directory => ', basePath + dirent.name + '/')
            if(DIRECTORY_IGNORE.indexOf (dirent.name ) == -1) {
                //console.log('reading the directory => ',dirent.name)
                readDirectory(basePath + dirent.name + '/')
            }
        }
    } // end of for

    return appendHTMLs
}

/**
 * process the file content and create a directory and create a index.html
 * @param {*} basePath 
 * @param {*} dirent 
 */
const process = async function (basePath, dirent) {

    
    //read the md 
    const fileContent =  await fsPromises.readFile(basePath+dirent.name,{encoding:'utf-8'})

    // jus get the filename without the extension. need to find a better way to do this. 
    const fileName = dirent.name.substring(0,dirent.name.length -3)

    //console.log(`filename => ${fileName}`)

    //Calling fsPromises.mkdir() when path is a directory 
    //that exists results in a rejection only when recursive is false.
    // remove the file extension. 
    await fsPromises.mkdir(`${TARGET_DIR}/content/${fileName}`,{recursive:true}).catch(console.error);

   
    const htmlFile = pretty(marked(fileContent))

    // create an index.html for every md file. with the filename as folder and index.html inside it.
    fsPromises.writeFile(`${TARGET_DIR}/content/${fileName}/index.html`,htmlFile,{flag:'w'}).catch(console.error);

    // modify_indexpage('/md/'+fileName+'/index.html',fileName)

    // $(`<a href="/md/${fileName}/index.html">${fileName}</a>`).appendTo('#content')

    return `<a href="/content/${fileName}/">${fileName}</a></br>`
}




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

    // $ = await loadIndexHTML();

    let htmls = await readDirectory(PROJECT_PATH+'md/')

    
    let page = 1
    let postPerPage = property.postPerPage
    let totalPosts = htmls.length
    let totalPageCount = Math.ceil(totalPosts/postPerPage);

    console.log(`total page count => ${totalPageCount}`)

    for(let j=0;j<totalPageCount;j++){

        $('#content').empty()
        for (let i = 0; i < postPerPage; i++) {
            $(htmls[i]).appendTo('#content')
            
        }



        //remove the process htmls from the array
        htmls = htmls.slice(postPerPage)
        console.log(`after slice => ${htmls}`)
        
        // increment the page count to point to the next page
        page++
        
        $( '#link_next').attr('href','#')
        $( '#link_prev').attr('href','#')
        if(page <= totalPageCount)
            $( '#link_next').attr('href',`/content/${page}`)
        if((page-1)!== 1){
            $( '#link_prev').attr('href',`/content/${page-2}`)
            if(page-2 === 1){
                $( '#link_prev').attr('href',`/`)
            }
            
        }
            
        //finalize the index html
        const prettyHTML = pretty($.html())

        //console.log(`pretty html => ${prettyHTML}`)

        await fsPromises.mkdir(`${TARGET_DIR}/content/${page}`,{recursive:true}).catch(console.error);
        if(j==0){
            // if it is the first page. then update the main index.html
            //finally update the main index html
            
            fsPromises.writeFile(`${TARGET_DIR}/index.html`,prettyHTML,{flag:'w'}).catch(console.error);
        } else {
            // write to the next page index.html
            
            fsPromises.writeFile(`${TARGET_DIR}/content/${page-1}/index.html`,prettyHTML,{flag:'w'}).catch(console.error);
        }

    }
    
     

   // htmls.forEach((html)=>$(html).appendTo('#content'));

    

    // console.log($.html())

   // const prettyHTML = pretty($.html())

    //finally update the main index html
   // fsPromises.writeFile(`${TARGET_DIR}/index.html`,prettyHTML,{flag:'w'}).catch(console.error);

    
}


start()


 
 
    