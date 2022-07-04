const express = require("express");
const request = require('request');
const cors = require('cors');
const compression = require('compression');


const PORT = process.env.PORT || 3001;
const app = express();


// use it before all route definitions
app.use(
  cors({origin: '*'}),
  compression(),
  (req, res, next) => {
    res.set('Cache-control', 'no-cache, no-store, max-age=0');  
  }
);

app.get("/", (req, res) =>{
  res.redirect("/posts");
});

app.get(["/posts", "/categories"], (req, res) => {  

  // Request URL
  if(parseInt(req.query.site) == 1){
    var url = 'https://themoviesflix.ac/wp-json/wp/v2'+req.url;
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
    }
    res.json(JSON.parse(result));
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});