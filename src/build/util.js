'use strict'

const fsPromises = require('fs').promises;
const path = require('path')
const pretty = require('pretty')
const marked = require('marked');
const FILE_IGNORE = ['.gitignore','server.js','server_new.js','package-lock.json','package.json']

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

/**
   * it will only read the basepath passed to it for processing.
   * used for content/markdown processing.
   * @param {*} basePath 
   */
  const processContent = async function (basePath,TARGET_DIR) {

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
                    let appendHTML = await process(basePath, dirent,TARGET_DIR)
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
const process = async function (basePath, dirent,TARGET_DIR) {

    
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

// export { processContent };

module.exports = processContent



