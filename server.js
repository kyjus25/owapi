const express = require('express');
const request = require('request');
const html2json = require('html2json').html2json;
const app = express();
const port = 3000;

const template = {
  "location": {
    "elevation": null,
    "north": null,
    "west": null,
  },
  "city": null,
  "state": null,
  "updated": null,
  // "station": {
  //   "name": "East Charleston Station",
  //   "callsign": "KCMI Station History"
  // },
  // "conditions": {
  //   "pressure": "30.08",
  //   "visibility": "10",
  //   "clouds": "Cloudy",
  //   "dewpoint": "69",
  //   "humidity": "57%",
  //   "rainfall": "0",
  //   "snowdepth": "0",
  // },
  "weather": {
    "icon": null,
    "readable": null
  },
  "wind": {
    "speed": null,
    "direction": null,
    "heading": null,
    "gusts": null
  },
  "high": null,
  "low": null,
  "temperature": null,
  "like": null,
  // "tonight": {
  //
  // },
  "forecast": null
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

      const htmlBody = body.match(/<mat-sidenav-content([\s\S]*?)(.*)<\/mat-sidenav-content>/g).toString();
      const jsonBody = html2json(htmlBody);
      const location = jsonBody.child[2].child[1].child[0].child[1].child[4];
      const cityState = jsonBody.child[2].child[1].child[0].child[5].child[0].child[0].child[0].child[0].child[0];

      template.location.elevation = location.child[0].child[1].child[0].child[1].child[1].child[0].text;
      template.location.north = location.child[0].child[1].child[0].child[2].child[0].text;
      template.location.west = location.child[0].child[1].child[0].child[4].child[0].text;

      template.city = req['query']['city'];
      template.state = req['query']['state'];
      template.updated = cityState.child[1].child[0].child[0].child[3].child[0].text;

      template.temperature = cityState.child[1].child[1].child[0].child[0].child[1].child[0].child[1].child[3].child[0].text;

      template.weather.icon = cityState.child[1].child[2].child[0].child[0].child[0].attr.src;
      template.weather.readable = cityState.child[1].child[2].child[0].child[0].child[1].child[0].text;

      template.high = cityState.child[1].child[1].child[0].child[0].child[0].child[0].child[0].text;
      template.low = cityState.child[1].child[1].child[0].child[0].child[0].child[2].child[0].text;
      template.like = cityState.child[1].child[1].child[0].child[0].child[2].child[1].child[0].text;
      template.forecast = cityState.child[1].child[4].child[0].child[0].child[1].child[0].text;

      template.wind.direction = cityState.child[1].child[2].child[0].child[1].child[1].child[0].child[1].child[0].text;
      template.wind.speed = cityState.child[1].child[2].child[0].child[1].child[1].child[0].child[2].child[0].child[0].text;
      template.wind.gusts = cityState.child[1].child[2].child[0].child[1].child[4].child[1].child[0].child[1].child[3].child[0].text;
      template.wind.heading = cityState.child[1].child[2].child[0].child[1].child[1].child[0].child[0].attr.style;

      // console.log(template.location);
      res.send(template);
    });
  } else {
    res.send({error: "Lowercase CITY (full name) and STATE (abbreviation) are required params."});
  }
});

app.get('/api/past', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
