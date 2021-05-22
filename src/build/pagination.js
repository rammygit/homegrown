'use strict'

const fsPromises = require('fs').promises;
const pretty = require('pretty')


/**
 * updated version for the paginate method. 
 * @param {*} $ 
 * @param {*} property 
 * @param {*} htmlsObject 
 * @param {*} TARGET_DIR 
 */
const getHTMLWithPagination = async function($,property,htmlsObject,TARGET_DIR){
    // let page = 1
    let postPerPage = property.postPerPage
    let totalPosts = htmlsObject.length
    let totalPageCount = Math.ceil(totalPosts/postPerPage);
    let paginatedHTMLs = []

    console.log(`total page count =>${totalPageCount} and total posts = ${totalPosts}`)

    /**
     *  $ points to the cheerio where the main index.html is loaded. 
     *  
     */

    for(let currentPageCount=0;currentPageCount<totalPageCount;currentPageCount++){

        $('#content').empty()
        
        const navObj = constructNavURL(htmlsObject,totalPosts,postPerPage,currentPageCount)

        $( '#link_prev').attr('href',navObj['prev'])
        $( '#link_next').attr('href',navObj['next'])


        htmlsObject.sort((a, b) => b.contentDate - a.contentDate)
        
        //splice will modify array in place. this is also modifyin the original array in the first place. 
        // i need to make  it immutable just in case if we need the original reference later. 
        htmlsObject.splice(0,postPerPage).forEach(html => {
            $(html).appendTo('#content')
        });

        // change the the text of the title of the site based from the config.json
        $('#h_blogTitle').text(property.blogTitle)
        // add the text for the subtitle based from config.json
        $('#h_blogSubTitle').text(property.blogSubTitle)

        //finalize the index html
        paginatedHTMLs.push( pretty($.html()))

    } // end of for loop

    return paginatedHTMLs
}

/**
 * 
 * @param {*} htmlsObject 
 * @param {*} totalPosts 
 * @param {*} postPerPage 
 * @param {*} currentPageCount 
 */
const constructNavURL = (htmlsObject,totalPosts,postPerPage,currentPageCount) => {
    let [firstPage,lastPage] = [false,false]
    let [prevURL,nextURL] = ['','']
    if(htmlsObject.length === totalPosts){
        firstPage = true
        prevURL = '/'
        nextURL = `/content/${currentPageCount+1}`
    }

    // if the length of htmls is less than postperpage then it is the last page. 
    // arr index starts at 0 so less than.
    if(htmlsObject.length <= postPerPage){
        lastPage = true
        nextURL = '#'
        //  usecase = if there are only 2 pages. 
        // when this is zero , point it to root index page
        if(currentPageCount-1 === 0){
            prevURL = '/'
        } else {
            prevURL = `/content/${currentPageCount-1}`
        }
    }

    // if any other pages in between
    if(!lastPage && !firstPage){
        // if second page , previous should point to index.html outside content. main. root
        if(currentPageCount == 1){
            prevURL = '/'
            nextURL = `/content/${currentPageCount+1}`
        } else {
            prevURL = `/content/${currentPageCount-1}`
            nextURL = `/content/${currentPageCount+1}`
        }
    }

    return {
        prev : prevURL,
        next : nextURL
    }
}


/**
 * 
 * @param {*} paginatedHtmls 
 */
const writePaginatedHTMLs = async (paginatedHtmls,TARGET_DIR) => {

    if(Array.isArray(paginatedHtmls)){

        for(let i=0;i<paginatedHtmls.length;i++){
            await writeIndexFiles(paginatedHtmls[i],i,TARGET_DIR)
        }
    } else {
        console.error('passed in input is not an array so processing stopped and build failed !! ')
    }
    
    
}


/**
 * Index starts at 0.
 * 
 * Async await will not work with callbacks. 
 * 
 * Try using map and not foreach. so using simple for loops
 * 
 * @param {*} element 
 * @param {*} index 
 */
const writeIndexFiles = async (prettyHTML,page,TARGET_DIR) => {
            
    // for last page, this creates an additional directory. need to move this into loop
    // await fsPromises.mkdir(`${TARGET_DIR}/content/${page}`,{recursive:true}).catch(console.error);
    if(page==0){
        // if it is the first page. then update the main index.html
        //finally update the main index html
        
        fsPromises.writeFile(`${TARGET_DIR}/index.html`,prettyHTML,{flag:'w'}).catch(console.error);
    } else {
        // write to the next page index.html
        await fsPromises.mkdir(`${TARGET_DIR}/content/${page}`,{recursive:true}).catch(console.error);
        fsPromises.writeFile(`${TARGET_DIR}/content/${page}/index.html`,prettyHTML,{flag:'w'}).catch(console.error);
    }

}


// export {paginate};

module.exports = {paginate: getHTMLWithPagination,writeHTMLs : writePaginatedHTMLs}