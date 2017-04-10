// creates socket connection to server
var socket = io();

// ************************************************************//
// **********************Pause feed scrolling********************
// ************************************************************//
var lastScrollTime;
var scrollVariable;
var stickyStart = 0;

function startScroll() {
    // console.log("INSIDE STARTSCROLL FUNCTION");
    if (stickyStart == 0) {
        stickyStart++;
        var scrollTime = 2000;
        $('html, body').animate({ scrollTop: $(window)[0].scrollHeight }, scrollTime);
        setTimeout(function() {
            scrollVariable = setInterval(function() {
                // console.log("scrollVariable still running");
                var elem = document.getElementById('box');
                elem.scrollTop = elem.scrollHeight;
            }, 1000);
        }, scrollTime);
    } else {
        // console.log("SKIPPED THE SETINTERVAL!");
    }
};

function scrollBottom() {};

window.onload = startScroll();

$(window).on('mousewheel', function() {
    clearInterval(scrollVariable); // DO WHATEVER STOPS THE SCROLLING
    stickyStart = 0;
    lastScrollTime = Date.now();
});

var scrollPauseTimer = setInterval(function() { // The timer to reload the site to the Home View after X minutes of inactivity
    // console.log("scrollPauseTimer still running");
    var currTime = Date.now();
    var timeDiff = currTime - lastScrollTime;
    // console.log("timeDiff is: " + timeDiff);
    if (timeDiff > 20000) {
        startScroll();
    }
}, 1000); // Check every 1 second about whether we need to start scrolling again



angular.module('twitterAngular', [])
    .controller('twitterControl', twitterControl);

twitterControl.$inject = ['$http'];

function twitterControl($http) {
    var tCtrl = this;
    // alert('Twitter controller loaded!');

    tCtrl.keywordSearch = function() {
        alert('Please refresh the page once.');
        $http.get('/twittersearch?word=' + tCtrl.word)
            .then(function(success) {
                console.log(tCtrl.word);
                //document.getElementById('resultWord').replace + tCtrl.word; //show word on page
                // tCtrl.word = " ";
            }, function(error) {
                alert('Click to continue.', error);
            });
    };
};

// $(function() {
//     var $word = $('#word');

//     $('#searchWord').on('click', function() {

//         var keyword = {
//             word: $word.val()
//         };

//         $.ajax({
//             type: 'POST',
//             url: '/searchTwitter',
//             data: keyword,
//             success: function(data) {
//                 document.getElementById('resultWord').append + data;
//             },
//             error: function() {
//                 alert('Error searching for Keyword!!');
//             }
//         });
//     });
// });

//*******************************************************************************//
//************ When tweeter event is received, add it to the page ***************//
//*******************************************************************************//
socket.on('key1', function(data) {
    console.log(data);
    var d = new Date();
    if (data.lang == 'en') {
        document.getElementById('stream').innerText += d.getHours() + ':' + d.getMinutes() + ' ' + data.text + '\n' + '\n';
        // console.log('woohoo its in English!');
    } else {
        // console.log('I cant even read this :( ');
    }
});
