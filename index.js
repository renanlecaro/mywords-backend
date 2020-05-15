// nodejs server for online features
require('dotenv').config()
var rp = require('request-promise');
var express = require('express')
var app = express()

const yandexApi='https://translate.yandex.net/api/v1.5/tr.json/translate'
// respond with "hello world" when a GET request is made to the homepage
app.get('/:lang_in/:lang_out/:text', function (req, res, next) {
  translateString(req.params)
    .then(t=>res.json(t), next)
})

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

function translateString({lang_in, lang_out, text}) {

  return rp({uri:yandexApi, qs:{
      key:process.env.YANDEX_API_KEY,
      text,
      lang:lang_in+'-'+lang_out
    }})
    .then(function (r) {
      return JSON.parse(r).text[0]
    })
}