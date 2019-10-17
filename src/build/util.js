'use strict'

const fsPromises = require('fs').promises;
const path = require('path')
const pretty = require('pretty')
const marked = require('marked');
const FILE_IGNORE = ['.gitignore','server.js','server_new.js','package-lock.json','package.json']
const cheerio = require('cheerio')
const matter = require('gray-matter');

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
  const processContent = async function (basePath,TARGET_DIR,PROJECT_DIR) {

    let appendHTMLs = []

    const dirArr = await fsPromises.readdir(basePath, { withFileTypes: true })



    // console.log('dirArr => ',dirArr)
    for (const dirent of dirArr) {

        const file_ext = path.extname(dirent.name)
        const stat = await fsPromises.lstat(basePath+dirent.name);

        if (stat.isFile()) {

            if (file_ext === '.html' || file_ext === '.js' || file_ext === '.css' || file_ext === '.md') {
                if(FILE_IGNORE.indexOf (dirent.name ) == -1) {

                    let appendHTML = await process(basePath, dirent,TARGET_DIR,PROJECT_DIR)
                    appendHTMLs.push(appendHTML)
                } 
            } 
        } else {

            if(DIRECTORY_IGNORE.indexOf (dirent.name ) == -1) {

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
const process = async function (basePath, dirent,TARGET_DIR,PROJECT_DIR) {

    
    //read the md 
    const fileContent =  await fsPromises.readFile(basePath+dirent.name,{encoding:'utf-8'})

    const frontMatter = matter(fileContent)

    // "data":{"PageTitle":"Maven Profile Override","LinkTitle":"How to Override Maven Profiles","Date":"09/01/2019","Author":"Ramkumar"}
    //console.log(`front matter => ${JSON.stringify(frontMatter)}`)

    console.log(`parsed data => ${frontMatter.data.PageTitle}`)

    // jus get the filename without the extension. need to find a better way to do this. 
    const fileName = dirent.name.substring(0,dirent.name.length -3)



    //Calling fsPromises.mkdir() when path is a directory 
    //that exists results in a rejection only when recursive is false.
    // remove the file extension. 
    await fsPromises.mkdir(`${TARGET_DIR}/content/${fileName}`,{recursive:true}).catch(console.error);

   //TODO: remove pretty here.
   // get the content from frontmatter object.
    // const htmlFile = await getPageHTMLContentToWrite(pretty(marked(fileContent)),PROJECT_DIR)
    const htmlFile = await getPageHTMLContentToWrite(pretty(marked(frontMatter.content)),PROJECT_DIR)

    

    // create an index.html for every md file. with the filename as folder and index.html inside it.
    fsPromises.writeFile(`${TARGET_DIR}/content/${fileName}/index.html`,htmlFile,{flag:'w'}).catch(console.error);

    const linkTitle = (frontMatter.data.PageTitle)?frontMatter.data.PageTitle:fileName
    
    return `<a href="/content/${fileName}/">${linkTitle}</a></br>`  
}

/**
 * get the html to pages.html 
 * @param {*} htmlContent 
 * @param {*} PROJECT_DIR 
 */
const getPageHTMLContentToWrite = async (htmlContent,PROJECT_DIR) => {


    const pageHtmlContent = await fsPromises.readFile(`${PROJECT_DIR}/pages/post.html`,{encoding:'utf-8'})
    //console.log(pageHtmlContent)
    // console.log(htmlContent)
    const $= cheerio.load(pageHtmlContent)
    $('#page_content').empty()
    $(htmlContent).appendTo('#page_content')
   // console.log('what is getting returned  => ',pretty($.html()))
    return pretty($.html())

}



module.exports = processContent



