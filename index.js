var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 20;
var x = canvas.width/2;
var y = canvas.height/2;
var dx = 0;
var dy = 0;
var ballColor = "#0095DD";
var storedDx = 60;
var storedDy = 0.5;
var widthShrink = 0;
var yBounce = 3;

document.getElementById("displayDx").innerHTML = storedDx^2;
document.getElementById("displayYBounce").innerHTML = yBounce;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

var time;

(function draw() {
    setTimeout(function() {

        // ReDraw background rectance
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the ball
        drawBall();

        // Bounce off left and right border
        if(x + dx > canvas.width-ballRadius-widthShrink
            || x + dx < ballRadius + widthShrink) {
            dx = -dx;
            // Bounce at a random shallow Y direction
            dy = (dy + yBounce) * (1 - 2 * Math.random());
        }

        // Bounce off top and bottom border
        if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        // move the ball
        x += dx;
        y += dy;

        // change the left and right inner boundaries
        widthShrink = 300 * Math.random() * Math.random();

        // loop the draw function
        window.requestAnimationFrame(draw);

    }, 1000 / 60); // Force 60fps
})(performance.now());


function chooseColor(choice){
    ballColor = choice;
}

function backgroundColor(choice){
    document.body.style.background = choice;
    document.getElementById("gameContainer").style.background = choice;
    document.getElementById("myCanvas").style.background = choice;
    // document.getElementById("buttons").style.background = choice;

}

function adjustSize(size){
    ballRadius = ballRadius * size;
}

function adjustSpeed(speed){
    storedDx = storedDx * speed;
    document.getElementById("displayDx").innerHTML = storedDx^2;
    // document.getElementById("displayDy").innerHTML = storedDy;
}

function adjustYbounce(bounce){
    yBounce = yBounce + bounce;
    if (yBounce > 8)
        yBounce = 8;
    if (yBounce < 0)
        yBounce = 0;
    document.getElementById("displayYBounce").innerHTML = yBounce;
    // document.getElementById("displayDy").innerHTML = storedDy;
}

function startTimer () {
    seconds++;
    appendSeconds.innerHTML = seconds/10;
}

function startSession() {
    clearInterval(Interval);
    Interval = setInterval(startTimer, 100);
}

function clearTimer() {
    clearInterval(Interval);
    seconds = 0;
}

var seconds = 0;
var Interval;
var appendSeconds = document.getElementById("seconds")

// Freeze the ball on button click, or restart movement
function pause(){
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0){
        widthShrink = 0;
        dx = 0;
        dy = 0;
        x = canvas.width/2;
        clearTimer();
        } else {
          dx = storedDx;
          dy = storedDy;
          startSession();
        }
}

// Fullscren when running
function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

var elem = document.body; // Make the body go full screen.


// Hide buttons when unpaused
const targetDiv = document.getElementById("buttons");
var canvasHeight = canvas.height;

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        if (targetDiv.style.display !== "none") {
            targetDiv.style.display = "none";
            pause();
            canvas.height = window.innerHeight
          } else {
            targetDiv.style.display = "block";
            pause();
            canvas.height = canvasHeight
          }
    }
}

const targetTimerDiv = document.getElementById("timer");
function toggleTimer(){
    if (targetTimerDiv.style.display !== "none") {
        targetTimerDiv.style.display = "none";
        } else {
        targetTimerDiv.style.display = "block";
        }
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen();
    }

}

// Blur the focus so when we pause, we don't keep pressing buttons
document.addEventListener("focus", (e) => {
    document.activeElement.blur()
  }, true);


// Stopwatch to time the length of each session
