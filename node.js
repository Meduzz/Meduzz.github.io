var http = require("http");
var fs = require("fs");
var path = require("path");

http.createServer(function(req, res) {
  console.log("Request coming in to: ", req.url);
  
  if (req.url === "/") {
    writeFile("index.html", "html", res);
  } else if (fs.existsSync(path.resolve("./"+req.url))) {
    if (req.url.indexOf(".css") !== -1) {
      writeFile(req.url, "css", res);
    } else if (req.url.indexOf(".js") !== -1) {
      writeFile(req.url, "js", res);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(8080, function(){
  console.log("Listening at 8080.");
});

function writeFile(file, type, res) {
  var p = path.resolve("./"+file);
  if (!fs.existsSync(p)) {
    console.log("no such file: ", p);
  }
  
  fs.readFile(p, {encoding:"utf-8"}, function(err, data) {
    if (err) {
      console.log(err);
      res.writeHeader(404);
      res.end();
    } else {
      res.statusCode = 200;

      switch (type) {
        case "html":
          res.setHeader("Content-Type", "text/html");
          break;
        case "css":
          res.setHeader("Content-Type", "text/css");
          break;
        case "js":
          res.setHeader("Content-Type", "text/javascript");
          break;
        default:
          console.log("spam");
          break;
      }

      res.write(data, "utf-8");
      res.end();
    }
  });
}