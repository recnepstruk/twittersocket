// require dependencies
var express = require('express');
var logger = require('morgan');
var io = require('socket.io');
var nodeTweetStream = require('node-tweet-stream');
var mySql = require('mysql');
var auth = require('./auth.js');

// set port to run server on
var PORT = process.env.PORT || 3000;

// create express app object
var app = express();

// ssh -i cloud.key <username>@<instance_ip>
// Set up the MySQL Pool
// global.pool = mysql.createPool({
//     connectionLimit : poolConnLimit, // Set based on the # of cluster workers that are running
//     waitForConnections: true, // If connectionLimit is temporarily exceeded, it will queue the request and wait for a connection to become available
//     queueLimit: 0, // 0 menas there is no limit to the number of queued connection requests (ie: requested waiting for a connection to become available)
//     host     : '208.113.XXX.XXX', // For the DreamCompute Dedicated MySQL server
//     user     : auth.mysql_usernameDC,
//     password : auth.mysql_passwordDC,
//     database : 'yourdbname'
// });

// pool.on('enqueue', function () {
//     // This would fire any time ALL of the connectionLimit connections
//     // are in use -- it means the current connection is added to the queue
//     // waiting for a connection to free up

//     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
//     console.log('Waiting for available MySQL Pool connection slot');
//     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
//     //handleErr('enqueueWait','Pool Enqueue',"More than the XXX pool connections are being used");
// });

// mount middleware
app.use(logger('dev'));
app.use(express.static('public'));

// listen for connections on port 3000
var server = app.listen(PORT, (err)=>{
    if(err){
        console.log("Error starting server ", err);
    } else {
        console.log("Started server on port ", PORT);
    }
});

// set up the twitter API - get the keys from the environment variables
var twitterStream1 = nodeTweetStream({
    consumer_key: auth.twitter_key, //process.env.consumer_key
    consumer_secret: auth.twitter_secret, //process.env.consumer_secret
    token: auth.twitter_token, //process.env.token
    token_secret: auth.twitter_secretToken //process.env.token_secret
});

// tell the twitter stream to track tweets by keyword
twitterStream1.track('lifestyle');
twitterStream1.track('cannabis');
twitterStream1.track('no pain');
// initialize a socket server
var socketServer = io(server);

// check for client connections
socketServer.on('connection', (socket)=>{
    console.log("Socket server connected! port", PORT);

    // check for tweet events and send the tweet to the clients
    twitterStream1.on('tweet', (tweetData)=>{
        //console.log(tweetData);
        if (/lifestyle|Lifestyle/.test(tweetData.text)) {
            socket.emit('key1', tweetData);
        } else if (/cannabis|Cannabis/.test(tweetData.text)) {
            socket.emit('key2', tweetData);
        } else if (/no pain| No Pain/.test(tweetData.text)) {
            socket.emit('key3', tweetData);
        } else {
            // console.log(tweetData.text);
        }
    });

});
