'use strict'

const fsPromises = require('fs').promises;
const pretty = require('pretty')

/**
 * @deprecated
 * adds the pagination feature to the content folder in the markdown format
 * 
 * this is deprecated . this is now refactored into 2 other methods. 
 * @param {*} $ 
 * @param {*} property 
 * @param {*} htmls 
 * @param {*} TARGET_DIR 
 */
const paginate = async function($,property,htmls,TARGET_DIR){
    let page = 1
    let postPerPage = property.postPerPage
    let totalPosts = htmls.length
    let totalPageCount = Math.ceil(totalPosts/postPerPage);

    console.log("total page count =>",totalPageCount)

    /**
     *  $ points to the cheerio where the main index.html is loaded. 
     *  
     */
    for(let j=0;j<totalPageCount;j++){

        $('#content').empty()
        for (let i = 0; i < postPerPage; i++) {
            $(htmls[i]).appendTo('#content')
        }

        //remove the process htmls from the array
        htmls = htmls.slice(postPerPage)
        
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


        // change the the text of the title of the site based from the config.json
        $('#h_blogTitle').text(property.blogTitle)
        // add the text for the subtitle based from config.json
        $('#h_blogSubTitle').text(property.blogSubTitle)


            
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

    } // end of for loop
}



/**
 * updated version for the paginate method. 
 * @param {*} $ 
 * @param {*} property 
 * @param {*} htmls 
 * @param {*} TARGET_DIR 
 */
const getHTMLWithPagination = async function($,property,htmls,TARGET_DIR){
    // let page = 1
    let postPerPage = property.postPerPage
    let totalPosts = htmls.length
    let totalPageCount = Math.ceil(totalPosts/postPerPage);
    let paginatedHTMLs = []

    console.log("total page count =>",totalPageCount)

    /**
     *  $ points to the cheerio where the main index.html is loaded. 
     *  
     */
    // let [firstPage,lastPage] = [false,false]

    for(let currentPageCount=0;currentPageCount<totalPageCount;currentPageCount++){

        $('#content').empty()
        // if htmls length is equal to total posts then it is the index page 
        
        //TODO:  this will modify the $ , need to update this to return the prev.next urls as object.
        const navObj = constructNavURL(htmls,totalPosts,postPerPage,currentPageCount)

        $( '#link_prev').attr('href',navObj['prev'])
        $( '#link_next').attr('href',navObj['next'])

        
        //splice will modify array in place. this is also modifyin the original array in the first place. 
        // i need to make  it immutable just in case if we need the original reference later. 
        htmls.splice(0,postPerPage).forEach(html => {
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
 * @param {*} htmls 
 * @param {*} totalPosts 
 * @param {*} postPerPage 
 * @param {*} currentPageCount 
 */
const constructNavURL = (htmls,totalPosts,postPerPage,currentPageCount) => {
    let [firstPage,lastPage] = [false,false]
    let [prevURL,nextURL] = ['','']
    if(htmls.length === totalPosts){
        firstPage = true
        prevURL = '/'
        nextURL = `/content/${currentPageCount+1}`
        // $( '#link_prev').attr('href','/')
        // $( '#link_next').attr('href',`/content/${currentPageCount+1}`)
    }

    // if the length of htmls is less than postperpage then it is the last page. 
    // arr index starts at 0 so less than.
    if(htmls.length < postPerPage){
        lastPage = true
        // $( '#link_next').attr('href','#')
        nextURL = '#'
        //  usecase = if there are only 2 pages. 
        // when this is zero , point it to root index page
        if(currentPageCount-1 === 0){
            // $( '#link_prev').attr('href','/')
            prevURL = '/'
        } else {
            prevURL = `/content/${currentPageCount-1}`
            // $( '#link_prev').attr('href',`/content/${currentPageCount-1}`)
        }
    }

    // if any other pages in between
    if(!lastPage && !firstPage){
        // if second page , previous should point to index.html outside content. main. root
        if(currentPageCount == 1){
            // $( '#link_prev').attr('href',`/`)
            prevURL = '/'
        } else {
            prevURL = `/content/${currentPageCount-1}`
            nextURL = `/content/${currentPageCount+1}`
            // $( '#link_prev').attr('href',`/content/${currentPageCount-1}`)
            // $( '#link_next').attr('href',`/content/${currentPageCount+1}`)
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

        for(let i=0;i<=paginatedHtmls.length;i++){
            console.log(i)
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