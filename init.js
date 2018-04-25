var solid = require('solid-server');
var express = require('express');
var https = require('https');
var path = require('path')
var fs = require('fs');
var request = require('request')
var util = require('util')

var port = 3000

var privateKey  = fs.readFileSync('./localhost.key', 'utf8');
var certificate = fs.readFileSync('./localhost.crt', 'utf8');

let credentials = {key: privateKey, cert: certificate};
let app = express();

let solidApp = solid({
    cache: 0, // Set cache time (in seconds), 0 for no cache
    serverUri:"https://localhost:"+port,
    live: true, // Enable live support through WebSockets
    root: './.data', // Root location on the filesystem to serve resources
    configPath:'./.config',
    dbPath:'./.db',
    secret: 'node-ldp', // Express Session secret key
    sslCert: './localhost.crt', // Path to the ssl cert 
    sslKey: './localhost.key', // Path to the ssl key
    mount: '/', // Where to mount Linked Data Platform
    webid: true, // Enable WebID+TLS+OIDC authentication
    suffixAcl: '.acl', // Suffix for acl files
    corsProxy: false, // Where to mount the CORS proxy 
    errorHandler: function(err, req, res, next){
        console.log(err)
    }, // function(err, req, res, next) to have a custom error handler
    errorPages: false // specify a path where the error pages are
})

app.use('/', solidApp)

var server = https.createServer(credentials, app)

server.listen(port, function(){ 
    console.log("launsch on port " + port);
})

var options = {
    url: "https://localhost:3000/test/test2.ttl",
    "rejectUnauthorized": false,
    headers:{
        'Content-Type':'text/turtle',
        'Link':'<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Slug':'test1'
    }
}

request.options(options, function(err, res, req, body){
    if (err)
        console.log("post err " + err)
})


/*
var ldp = solid.createServer({
    cache: 0, // Set cache time (in seconds), 0 for no cache
    serverUri:"https://localhost:"+port,
    live: true, // Enable live support through WebSockets
    root: './.data', // Root location on the filesystem to serve resources
    configPath:'./.config',
    dbPath:'./.db',
    secret: 'node-ldp', // Express Session secret key
    sslCert: './localhost.crt', // Path to the ssl cert 
    sslKey: './localhost.key', // Path to the ssl key
    mount: '/', // Where to mount Linked Data Platform
    webid: true, // Enable WebID+TLS+OIDC authentication
    suffixAcl: '.acl', // Suffix for acl files
    corsProxy: false, // Where to mount the CORS proxy 
    errorHandler: function(err, req, res, next){
        console.log(err)
    }, // function(err, req, res, next) to have a custom error handler
    errorPages: false // specify a path where the error pages are})
})

ldp.listen(3000, function(){
    console.log("launched on port " + port)
})
*/