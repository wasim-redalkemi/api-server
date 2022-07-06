const express = require("express");
const request = require('request');
const cors = require('cors');
const compression = require('compression');


const PORT = process.env.PORT || 3001;
const app = express();


// use it before all route definitions
app.use(
  cors({origin: '*'}),
  compression()
);

app.get("/", (req, res) =>{
  res.redirect("/posts");
});

app.get(["/posts", "/categories"], (req, res) => {  

  // Request URL
  if(parseInt(req.query.site) == 1){
    var url = 'https://themoviesflix.cx/wp-json/wp/v2'+req.url;
  }
  else{
    var url = 'https://hdmoviesflix.shop/wp-json/wp/v2'+req.url;
  }
  //console.log(url);
  request(url, (error, response, body) => { 
    //console.log(response.headers['x-wp-totalpages']);
    if(error){
      result = error;
    }
    else{
      result = body;
      res.set('totalPages', response.headers['x-wp-totalpages']);

      //disable cache
      res.set('Cache-control', 'no-cache, no-store max-age=0');
    }
    res.json(JSON.parse(result));
  });
});


app.get("/generate-sitemap", (req, res) => {

  const url = "https://themoviesflix.cx/wp-json/wp/v2/posts?order_by=modified&per_page=50";
  const sitemap_url = "https://movies-king.herokuapp.com/download/";

  request(url, (error, response, body) => {

    var result = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    `;

    JSON.parse(body).map((item, index) => {
      result += `
        <url>
          <loc>${sitemap_url + item.slug}</loc>
        </url>
      `;
    });

    result += `</urlset>`; 
    //disable cache
    res.set({
      'Cache-control' : 'no-cache, no-store max-age=0',
      'Content-Disposition' : `attachment; filename=sitemap_posts.xml`
    });
    res.send(result.trim());

  });
  
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});