const corsMiddleware = require('restify-cors-middleware')
const restify = require ('restify')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./echoes.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Opened a conenction to the Harrowing Echoes database.')
})

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:3000'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

const server = restify.createServer()
server.pre(cors.preflight)
server.use(cors.actual)

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
})

server.get('/maps', function (req, res) {
  db.serialize( () => {
    db.get(`WITH
            prefix AS (SELECT * FROM (SELECT prefix FROM mapPrefixes AS prefix ORDER BY RANDOM() LIMIT 1)),
            map AS (SELECT * FROM (SELECT map FROM maps AS prefix ORDER BY RANDOM() LIMIT 1))
            SELECT * FROM prefix, map;`, (err, row) => {
      if (err) {
        console.error(err.message)
      } else {
        let mapName = row.prefix + " " + row.map
        res.send(200, {
          level: {
            grid: [['#','#','#','#','#','#','#','#','#'],
                  ['#','•','•','•','•','•','•','•','#'],
                  ['#','•','•','•','•','•','•','•','#'],
                  ['#','•','g','•','@','•','p','•','#'],
                  ['#','•','•','•','•','•','•','•','#'],
                  ['#','•','•','•','•','•','•','•','#'],
                  ['#','#','#','#','#','#','#','#','#']],
            title: mapName
          }
        })
      }
    })
  })
})

server.get('/name', function (req, res) {
  db.serialize( () => {
    db.get(`SELECT name FROM names ORDER BY RANDOM() LIMIT 1;`, (err, row) => {
      if (err) {
        console.error(err.message)
      } else {
        let name = row.name
        res.send(200, {
          name: name
        })
      }
    })
  })
})

server.get('/scores', function (req, res) {
  res.send(200, {
    scores: ["Chad the Lvl 1 commoner, killed by a giant."]
  })
})