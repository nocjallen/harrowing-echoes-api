const corsMiddleware = require('restify-cors-middleware')
const errors = require('restify-errors')
const restify = require ('restify')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./echoes.db', sqlite3.OPEN_READWRITE, (err) => {
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

//Restify Middleware
server.pre(cors.preflight)
server.use(cors.actual)
server.use(restify.plugins.bodyParser())

//Restify Server
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
            grid: [
                  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','g','::','@','::','s','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','::','::','::','::','::','::','::','::','::','::','::','::','::','#'],
                  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#']
                ],
            npcs: [
              {
                name: "goblin",
                symbol: "g",
                damage: 1,
              },
              { 
                name: "spider",
                symbol: "s",
                damage: 1
              }
            ],
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

server.get('/leaderboard', function (req, res) {
  db.serialize( () => {
    db.all(`SELECT * FROM leaderboard;`, (err, rows) => {
      if (err) {
        console.error(err.message)
      } else {
        res.send(200, {
          leaderboard: rows
        })
      }
    }
    )
  })
})

server.post('/leaderboard', function (req, res, next) {
  if (!req.is('application/json')) {
    return next(new errors.InvalidContentError("This API expects: 'application/json'"))
  }
  let data = req.body
  try {
    db.serialize( () => {
      db.run(`INSERT INTO leaderboard(name, message, score) VALUES(?,?,?)`, data.name, data.message, data.score, function(err) {
        if (err) {
          res.send(500)
          return next(console.error(err.message))
        } else {
          res.send(201)
          console.log("Updated leaderboard.")
          next()
        }
      })
    })
  } catch (error) {
    return next(new errors.InternalError(error.message))
  }
})