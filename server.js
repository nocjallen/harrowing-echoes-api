const restify = require ('restify');

const server = restify.createServer();

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
})

server.get('/maps', function (req, res) {
  res.send(200, {
//level: ["#########", "#•••••••#", "#•••@•••#", "#•••••••#", "#########"]
  level: {
    grid: [['#','#','#','#','#','#','#','#','#'],
          ['#','•','•','•','•','•','•','•','#'],
          ['#','•','•','•','•','•','•','•','#'],
          ['#','•','•','•','@','•','•','•','#'],
          ['#','•','•','•','•','•','•','•','#'],
          ['#','•','•','•','•','•','•','•','#'],
          ['#','#','#','#','#','#','#','#','#']],
    title: "A Simple Map"
  }
  });
})

server.get('/scores', function (req, res) {
  res.send(200, {
    scores: ["Chad the Lvl 1 commoner, killed by a giant."]
  })
})