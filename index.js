var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 30;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 0;
var dy = 0;
var ballColor = "#0095DD";
var storedDx = 20;
var storedDy = 0.5;
var widthShrink = 0;
document.getElementById("displayDx").innerHTML = storedDx^2;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    // Bounce off left and right border
    if(x + dx > canvas.width-ballRadius-widthShrink
        || x + dx < ballRadius + widthShrink) {
        dx = -dx;
        // Bounce at a random shallow Y direction
        dy = dy * (1 - 3 * Math.random()) + (1 - 3 * Math.random());
    }

    // Bounce off top and bottom border
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    x += dx;
    y += dy;
    widthShrink = 300 * Math.random() * Math.random();

}

function chooseColor(choice){
    ballColor = choice;
}

function backgroundColor(choice){
    document.body.style.background = choice;
    document.getElementById("gameContainer").style.background = choice;
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

function adjustAngle(angle){
    storedDy = storedDy * angle;
}

// Freeze the ball on button click, or restart movement
function pause(){
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0){
        widthShrink = 0;
        dx = 0;
        dy = 0;
        x = canvas.width/2;
        } else {
          dx = storedDx;
          dy = storedDy;
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

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        if (targetDiv.style.display !== "none") {
            targetDiv.style.display = "none";
            pause();
            // requestFullScreen(elem);
          } else {
            targetDiv.style.display = "block";
            pause();
            // requestFullScreen(elem);
          }
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



setInterval(draw, 1);
