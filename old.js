const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');

getCities((cities) => {
  async.map(cities, (city, callback) => {
    getStories(city, (stores) => {
      callback(null, stores);
    })
  }, (err, results) => {
    console.log([].concat.apply([], results));
    fs.writeFile("stores.txt", JSON.stringify(results), function (err){
        if (err) {
            console.log(err);
        } else {
            console.log("File saved");
        }
    });
  })
})

function getCities(callback) {
    var cities = ['台北市','新北市','基隆市','宜蘭縣','桃園市','新竹縣','新竹市','苗栗縣','台中市','彰化縣','南投縣','雲林縣','嘉義縣','嘉義市','台南市','高雄市','屏東縣','台東縣','花蓮縣','澎湖縣','金門縣','連江縣'];
    callback(cities);
}

function getStories(city, callback) {
  var options = {
    url: 'https://api.map.com.tw/net/familyShop.aspx?searchType=ShopList&type=&city=' + encodeURI(city) + '&area=&road=&fun=showStoreList&key=6F30E8BF706D653965BDE302661D1241F8BE9EBC',
    method: 'GET',
    headers: { 'Referer': 'https://www.family.com.tw/marketing/inquiry.aspx' }
  }
  request(options, (err, res, body) => {
    var str = body.slice(14);
    str = str.slice(0, -1);
    objStore = JSON.parse(str);
  
    var stores = [];

    objStore.forEach(function (item) {
        var it = {
          id: item.pkey,
          city: city,
          store: item.NAME,
          address: item.addr,
        }
        stores.push(it);
    });
    
    callback(stores)
  })
}