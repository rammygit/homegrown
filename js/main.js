// using remarkable for rendering md on the fly.

const md = new Remarkable({
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    linkify: false, // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
    }

  });

  const fileExt = ".md";
  $.get('https://dreamy-swanson-53e5a7.netlify.com/md', function(data) {
//   $.get('http://localhost:8000/md', function(data) {
    
    console.log(data)
    $("#content").html('<ul>');
                   //List all xml file names in the page

                    //var filename = this.href.replace(window.location, "").replace("http:///", "");
                   //$("#fileNames").append( '<li>'+filename+'</li>');

                    $(data).find("a:contains(" + fileExt + ")").each(function () {
                        $("#content").append( '<li><a class="contentlink" href="#">'+$(this).text()+'</a></li>');

                    });
                    $("#content").append('</ul>');


                    $("#content>li>a").click(function(e) {
                        //Do stuff when clicked
                
                        console.log('clicked ')
                       
                        $.get('https://dreamy-swanson-53e5a7.netlify.com/md/'+e.currentTarget.outerText,function(data){
                        // $.get('http://localhost:8000/md/'+e.currentTarget.outerText,function(data){
                            const rendered = md.render(data)
                            localStorage.setItem('blogEntry', rendered); 
                            window.location.href = "page.html";

                        })
                        
                        

                    });  

    //document.getElementById("content").innerHTML = md.render(data)
}, 'text');


// $(document).ready(function() {
    
// });

  
//   document.getElementById("content").innerHTML = md.render('# Remarkable rulezz!')
