const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

const template = {
  "location": {
    "elevation": "",
    "north": 39,
    "west": 88.8,
  },
  "city": "",
  "state": "",
  "updated": "",
  "station": {
    "name": "East Charleston Station",
    "callsign": "KCMI Station History"
  },
  "conditions": {
    "pressure": "30.08",
    "visibility": "10",
    "clouds": "Cloudy",
    "dewpoint": "69",
    "humidity": "57%",
    "rainfall": "0",
    "snowdepth": "0",
  },
  "weather": "Mostly Cloudy",
  "wind": {
    "type": "Gusts",
    "speed": "7"
  },
  "high": null,
  "low": 69,
  "temperature": 91,
  "like": 99,
  "tonight": {

  },
  "forecast": "Tomorrows temp is to be warmer than today"
};



app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/current', (req, res) => {
  if (req['query']['state'] && req['query']['city']) {
    const options = {
      url: `https://www.wunderground.com/weather/us/${req['query']['state']}/${req['query']['city']}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      }
    };
    request(options, function (error, response, body) {
      // console.error('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      // const filter1 = body.match(/<lib-city-header([\s\S]*?)(.*)lib-city-header>/g);

      // Main Body Object
      const htmlBody = body.match(/<mat-sidenav-content([\s\S]*?)(.*)<\/mat-sidenav-content>/g).toString();

      const filter1 = htmlBody.match(/<lib-city-header([\s\S]*?)(.*)<\/lib-city-header>/g).toString();

      // Location Object
      const filter2 = filter1.match(/Elev([\s\S]*?)(.*)°W/g).toString();
      const filter3 = filter2.match(/<strong\s\S*?>([\s\S]*?)<\/strong>/g);

      // City & State
      const filter4 = filter1.match(/<h1\s\S*?>([\s\S]*?)<\/h1>/g).toString();
      const filter5 = filter4.match(/<span\s\S*?>([\s\S]*?)<\/span>/g);

      // Going after current temp first

      const responseObj = {
        location: {
          elevation: filter3[0].match(/<strong\s\S*?>([\s\S]*?)<\/strong>/)[1].trim(),
          north: filter3[1].match(/<strong\s\S*?>([\s\S]*?)<\/strong>/)[1].trim(),
          west: filter3[2].match(/<strong\s\S*?>([\s\S]*?)<\/strong>/)[1].trim()
        },
        city: filter5[0].match(/<span\s\S*?>([\s\S]*?)<\/span>/)[1].split(',')[0].trim(),
        state: filter5[0].match(/<span\s\S*?>([\s\S]*?)<\/span>/)[1].split(',')[1].trim(),

      };
      res.send(responseObj);
    });
  } else {
    res.send({error: "CITY and STATE are required params."});
  }
});

app.get('/api/past', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
