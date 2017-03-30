// creates socket connection to server
var socket = io();
$('#stream1').hide();
$('#stream3').hide();
$('#stream2').hide();
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

function scrollBottom() {
};

window.onload = startScroll();

$(window).on('mousewheel', function(){
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

// when tweeter event is received, add it to the page
socket.on('key1', function(data) {
    // console.log(data);
    var d = new Date();
    document.getElementById('stream1').innerText += d.getHours() + ':' + d.getMinutes() + ' ' + data.text + '\n' + '\n';
});
socket.on('key2', function(data) {
    // console.log(data);
    var d = new Date();
    document.getElementById('stream2').innerText += d.getHours() + ':' + d.getMinutes() + ' ' + data.text + '\n' + '\n';
});
socket.on('key3', function(data) {
    // console.log(data);
    var d = new Date();
    document.getElementById('stream3').innerText += d.getHours() + ':' + d.getMinutes() + ' ' + data.text + '\n' + '\n';
});
