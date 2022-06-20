const express = require("express");
const request = require('request');
var cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();


// use it before all route definitions
app.use(cors({origin: '*'}));

app.get(["/posts", "/categories"], (req, res) => {  
  // Request URL
  var url = 'https://themoviesflix.ac/wp-json/wp/v2'+req.url;
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