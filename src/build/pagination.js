'use strict'

const fsPromises = require('fs').promises;
const pretty = require('pretty')

/**
 * adds the pagination feature to the content folder in the markdown format
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

// export {paginate};

module.exports = paginate