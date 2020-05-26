// nodejs server for online features
require('dotenv').config()
var rp = require('request-promise');
var express = require('express')
const rateLimit = require("express-rate-limit");
var app = express()

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1500 // limit each IP to 1500 requests per 24h
});

app.use(limiter)

app.get('/', function (req, res, next) {
  res.end('OK')
})

app.get('/translate/:lang_in/:lang_out/:text', function (req, res, next) {
  translateString(req.params)
    .then(t=>res.json(t), next)
})

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



const yandexApi='https://translate.yandex.net/api/v1.5/tr.json/translate'

function translateString({lang_in, lang_out, text}) {
  if(text.length>200) return Promise.reject('Text too long, max 200 chars')
  return rp({uri:yandexApi, qs:{
      key:process.env.YANDEX_API_KEY,
      text,
      lang:lang_in+'-'+lang_out
    }})
    .then(function (r) {
      return JSON.parse(r).text[0]
    })
}