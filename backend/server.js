const http = require('http')
const app =  require("./app")
var bodyParser = require('body-parser')

app.set('port',process.env.PORT || 3000)
const server = http.createServer(app)

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

server.listen(process.env.PORT || 3000)