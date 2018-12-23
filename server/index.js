const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8081;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

router.get('/weather', async function(req, res) {
  if (!req.query.town) {
    res.status(400);
    return res.send('Parameter "town" is required');
  }

  const stripToAlphaNum = /[^a-z0-9+,]+/gi;
  const baseUrl = 'http://api.openweathermap.org/data/2.5';
  const params = 'mode=json&units=metric&cnt=7&appid=0a2f04c63f14c213285ff39d5d647ceb';
  const url = `${baseUrl}/forecast?q=${req.query.town.replace(stripToAlphaNum, '%20')}&${params}`;

  fetch(url)
    .then(response => response.json())
    .then(data => res.json(data));
});

app.use('/api/v1', router);

app.listen(port);
console.log('Gateway is listening on port ' + port);
