// api.openweathermap.org/data/2.5/weather?q=pune&appid=7915b47c2116b0e71ce72c67083773eb
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?q=pune&appid=
// https://api.openweathermap.org/data/2.5/weather?q=pune&appid=34cdcdcc466ada8f24a285b3c7d5f2ee&units=metric

var http = require("http");
const fs = require("fs");
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal , orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);

    return temperature;
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=34cdcdcc466ada8f24a285b3c7d5f2ee&units=metric")
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        // console.log(arrdata[0].main.temp);
        const realtimedata = arrdata.map((val) => 
            replaceVal(homeFile,val))
            .join(" ");
        res.write(realtimedata);
        // console.log(realtimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");
