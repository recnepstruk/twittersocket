// require dependencies
var express = require('express');
var logger = require('morgan');
var mysql = require('mysql');
var auth = require('./auth.js');
var io = require('socket.io');
var nodeTweetStream = require('node-tweet-stream');
var bodyParser = require('body-parser');

// set port to run server on
var PORT = process.env.PORT || 3000;
// create express app object
var app = express();

//***********************************START MYSQL****************************************//

//Set up the MySQL Pool
var connection = mysql.createConnection({
    connectionLimit: 100, // Set based on the # of cluster workers that are running
    waitForConnections: true, // If connectionLimit is temporarily exceeded, it will queue the request and wait for a connection to become available
    queueLimit: 0, // 0 means there is no limit to the number of queued connection requests (ie: requested waiting for a connection to become available)
    host: 'localhost',
    user: auth.mysql_username,
    password: auth.mysql_password,
    database: 'twitterdb'
});

connection.on('connection', function(connection) {
    // This would fire any time ALL of the connectionLimit connections
    // are in use -- it means the current connection is added to the queue
    // waiting for a connection to free up
    console.log('New connection made!');
    handleErr("More than the 100 pool connections are being used");
});

//***********************************END MYSQL****************************************//

// mount middleware
app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());

// listen for connections on port 3000
var server = app.listen(PORT, (err) => {
    if (err) {
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

//initialize a socket server
var socketServer = io(server);
var arryOfWords = [];


app.post('/addKeyword', (req, res) => {
    var word2Add = req.body.word2Add;
    // word2Add = word2Add.toString();
    console.log(word2Add);
    console.log(typeof(word2Add));

    arryOfWords.push(word2Add);

    // tell the twitter stream to track the new keyword
    twitterStream1.track(word2Add);

    // check for client connections
    if (arryOfWords = 1) {
        socketServer.on('connection', (socket, err) => {
            if (err) {
                console.log("Error starting socket ", err);
            } else {
                console.log("Started socket");
            }
        });
    } else if (arryOfWords > 1) {
        // check for tweet events and send the tweet to the clients
        twitterStream1.on('tweet', (tweetData) => {
            if (tweetData.lang == 'en') {
                var logit = true;
                if (tweetData.text) {
                    socket.emit('key1', tweetData);
                    console.log('emitting socket data!!!!!!');
                    var keyword = word2Add;
                    var screenName = tweetData.user.screen_name;
                    var numFollowers = tweetData.user.followers_count;
                    var location = tweetData.user.location;
                    // MySQL Command: 
                    var query = 'INSERT INTO twitterInfo SET ? ON DUPLICATE KEY UPDATE ' +
                        'numFollowers = VALUES(numFollowers), count = count + 1, lastDate = CURRENT_TIMESTAMP';
                    var insertObj = { keyword: keyword, screenName: screenName, numFollowers: numFollowers, location: location };
                    connection.query(query, insertObj, function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('MySQL Data: ' + result);
                        }
                    });
                } else {
                    var keyword = '??? ' + tweetData.text;
                    logit = false;
                }
            }
        });
    };
    var postReturnData = { arryOfWords: arryOfWords };
    res.send(postReturnData);
});

app.get('/showdata', (req, res) => {
    connection.query('SELECT * FROM twitterInfo', function(err, rows) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(rows);
            res.send(body);
        };
    });
});
