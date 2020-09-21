var express = require("express"); 
var axios = require('axios');
var router = express.Router();

const testurl = "https://api.hnpwa.com/v0/news/1.json";
const basic = "https://naveropenapi.apigw.ntruss.com/tts-basic/v1/tts";

const data = {
    params: {
        "speaker" : 'mijin',
        "speed" : "0",
        "text" : "hello"
    }
}

const config = {
    headers: {
        "X-NCP-APIGW-API-KEY-ID" : "rjv150bah6",
        "X-NCP-APIGW-API-KEY" : "IzFMCaeonfhGExNRRt1ZQfkng2dcRGN3A4FvOr0q",
        "Content-Type" : "application/x-www-form-urlencoded"
    }
}

router.get("/", function(req, res, next) {
    axios.post(basic,  data,config)
        .then((response) => {
            console.log(response);
            console.log('response!!!!')
        })
        .catch((error) => {
            console.log(error)
            console.log('error!!!!')
        })
    ;
    res.send('before');
});

module.exports = router;