//frontmatter_processor.js

/**
 * This is a optional. Front Matter is only advanced customization. (atleast for now )
 * If you have no mood for it, site builder should be fine with it.
 * 
 * Front matter can contain reading speed. If you can calculate upfront manually, 
 * site builder will skip the calculation for the reading minutes. 
 * 
 * 
 */

const matter = require('gray-matter')
const fs = require('fs')

// process reading minutes

/**
 * fetch the array of words ( replace the line breaks with spaces and then split by spaces)
 * 
 * normal reading speed is 300 words per minute for an adult. 
 * 
 * so for every 300 entries in array , increment a count with 1.
 * 
 * so finally you get the appx reading time. 
 * 
 * Display this as reading time in the post entry. 
 * 
 */

 const getFrontMatterObj = (filePath) => {

    const fileContent = fs.readFileSync(filePath);

    const fileObj = matter(fileContent)


 }

