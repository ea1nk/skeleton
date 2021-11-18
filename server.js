console.log(
    `

███████╗ ██████╗ ██████╗     ██████╗ ███████╗██╗   ██╗██╗ ██████╗███████╗███████╗
██╔════╝██╔════╝██╔═══██╗    ██╔══██╗██╔════╝██║   ██║██║██╔════╝██╔════╝██╔════╝
███████╗██║     ██║   ██║    ██║  ██║█████╗  ██║   ██║██║██║     █████╗  ███████╗
╚════██║██║     ██║▄▄ ██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║     ██╔══╝  ╚════██║
███████║╚██████╗╚██████╔╝    ██████╔╝███████╗ ╚████╔╝ ██║╚██████╗███████╗███████║
╚══════╝ ╚═════╝ ╚══▀▀═╝     ╚═════╝ ╚══════╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
                                                                                 
███████╗ █████╗  ██╗███╗   ██╗██╗  ██╗                                           
██╔════╝██╔══██╗███║████╗  ██║██║ ██╔╝                                           
█████╗  ███████║╚██║██╔██╗ ██║█████╔╝                                            
██╔══╝  ██╔══██║ ██║██║╚██╗██║██╔═██╗                                            
███████╗██║  ██║ ██║██║ ╚████║██║  ██╗           
2021 Skeleton - Node JS + Express Server Boilerplate

`
)

require('dotenv').config()

const fs = require('fs')

const express = require('express')
const morgan = require('morgan')
const http = require('http')
const http_port = process.env.HTTP_PORT || 80
const https = require('https')
const https_port = process.env.HTTPS_PORT || 443
const public_dir = process.env.PUBLIC_DIR || 'public'

const keyFile = 'self-signed.key'
const certFile = 'self-' + 'signed.crt'

const websocketServer = require('ws').Server

const app = express();
app.use(morgan('dev'));

/* Force any http connection to redirect to https. Comment this block to disable*/

const httpServer = http.createServer((req, res) => {
    var hostName = req.headers['host'].split(":")[0]
    res.writeHead(301, { "Location": "https://" + hostName + ":" + https_port + req.url });
    res.end();
}).listen(http_port)

/* HTTPS Server*/

const httpsServer = https.createServer({
    key: fs.readFileSync(__dirname + '/certs/' + keyFile),
    cert: fs.readFileSync(__dirname + '/certs/' + certFile)
}, app).listen(https_port, () => {
    console.log(`HTTPS Server running on ${https_port}`)
})

/* Websocket Server */
const wss_server = new websocketServer({ server: httpsServer })

wss_server.on('connection', (ws) => {
    ws.send('Hello Client');

    console.log('Client connected')

    //On incoming message
    ws.on('message', (message) => {
        console.log(`Websocket: ${message}`)
    })

    //On client disconnect
    ws.on('close', () => {
        console.log('Client disconnected')
    })

    //On error
    ws.on('error', (error) => {
        console.log(error)
    })

})

/*Routes*/

app.get('/api', (req, res) => {
    res.json({ message: 'Hello World' })
})

/* Static content */

app.use(express.static(__dirname + "/" + public_dir))