const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const { ExpressPeerServer } = require('peer');
const port = process.env.PORT || "9000"; 

const peerServer = ExpressPeerServer(server, {
    proxied: true,
    debug: true,
    path: '/', 
    ssl: {} //best to use --sslkey and -sslcert options (with path) in CLI, similarly include --allow_discovery true
});

app.use(peerServer);

app.use(express.static(path.join(__dirname)));

app.get("./", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});
server.listen(port);

console.log('Listening on: ' + port);
