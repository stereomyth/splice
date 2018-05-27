require('now-env');
const axios = require('axios');
const parse = require('./steps/parse.js');
const convert = require('./steps/convert.js');
const save = require('./steps/save.js');

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333/weekly_film_times.xml'
    : 'https://www.cineworld.co.uk/syndication/weekly_film_times.xml';

module.exports = () =>
  axios
    .get(url)
    .then(res => parse(res.data))
    .then(convert)
    .then(save)
    .then(JSON.stringify)
    .catch(err => {
      console.log(err);
      return 'nope';
    });
