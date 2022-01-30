var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
var ballRadius = 40;
var x = Math.max(canvas.width/2,550);
var y = canvas.height/2;
var dx = 0;
var dy = 0;
var ballColor = 'pink' // blue "#0095DD";
var storedDx = 80;
var storedDy = 0.5;
var widthShrink = 0;
var yBounce = 4;
var widthShrinkMultiplier = 300;

document.getElementById("displayDx").innerHTML = storedDx/10;
document.getElementById("displayYBounce").innerHTML = yBounce;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

let runSession = false;

(function draw() {

    setTimeout(function() {

        // console.log('x',x,'y',y);
        // ReDraw background rectance
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the ball
        drawBall();

        // Bounce off left and right border
        if(runSession){
            if(x + dx > canvas.width - +ballRadius - +widthShrink
                || x + dx < +ballRadius + +widthShrink) {

                // console.log('widthShrink',widthShrink);
                // console.log('Hit x border','x',x,'dx',dx)

                dx = -dx;
                // Bounce at a random shallow Y direction
                dy = (dy + yBounce) * (1 - 2 * Math.random());
            }
        }

        // Bounce off top and bottom border
        if(y + dy > canvas.height - +ballRadius || y + dy < +ballRadius) {

            // console.log('Hit y border','y',y,'dy',y)
            dy = -dy;
        }

        // move the ball
        x += dx;
        y += dy;

        // change the left and right inner boundaries
        if(runSession){
            widthShrink = widthShrinkMultiplier * Math.random() * Math.random();
        }
        // loop the draw function
        window.requestAnimationFrame(draw);
        console.log(widthShrink);
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

const sizeSlider = document.getElementById("sizeRange");

// soundElementIframe.appendChild(sizeSlider);
// noUiSlider.create(sizeSlider, options);

const sizeDisplay = document.getElementById("displaySize");
sizeDisplay.innerHTML = sizeSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sizeSlider.oninput = function() {
    sizeDisplay.innerHTML = this.value;
    adjustSize();
}

function adjustSize(){
    ballRadius = sizeSlider.value;
    // ballRadius = ballRadius * size;
    console.log(sizeSlider.value,ballRadius);
}

function adjustSpeed(speed){
    storedDx = Math.max(0,storedDx + (speed * 10));
    document.getElementById("displayDx").innerHTML = storedDx/10;
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

// Stopwatch to time the length of each session
var seconds = 0;
var Interval;
var appendSeconds = document.getElementById("seconds")

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

function resetPosition(){
    widthShrinkMultiplier = 0;
    dx = 0;
    dy = 0;
    x = Math.max(canvas.width/2,550)
    y = canvas.height/2;
}

// Freeze the ball on button click, or restart movement
function pause(){
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0){
        resetPosition();
        clearTimer();
        runSession = false;
        } else {
          y = canvas.height/4;
          dx = storedDx;
          dy = storedDy;
          startSession();
          widthShrinkMultiplier = 300;
          runSession = true;
        }
}

// Fullscren when running
var elem = document.body; // Make the body go full screen.

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

var canvasHeight = canvas.height;
var canvasHeightFull = window.innerHeight - 50

function resizeCanvas() {
    canvas.height = canvasHeight;
    canvas.width = window.innerWidth;
}

window.addEventListener('resize', resizeCanvas, false);


// Start/stop the ball
function startButton(){
    if (targetDiv.style.display !== "none") {
        targetDiv.style.display = "none";
        // Full height
        canvas.height = canvasHeightFull;
        canvas.width = window.innerWidth;
        pause();
      } else {
        targetDiv.style.display = "block";
        // Original height
        canvas.height = canvasHeight;
        pause();
      }
}


// Hide buttons when unpaused
const targetDiv = document.getElementById("buttons");

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        if (targetDiv.style.display !== "none") {
            targetDiv.style.display = "none";
            // Full height
            canvas.height = canvasHeightFull;
            canvas.width = window.innerWidth;
            pause();
          }
          else {
            targetDiv.style.display = "block";
            // Original height
            canvas.height = canvasHeight;
            pause();
          }
    }
}

canvas.addEventListener("click", function () {
    if (targetDiv.style.display === "none"){
        targetDiv.style.display = "block";
            // Original height
            canvas.height = canvasHeight;
            pause();
        }
 });

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
        // console.log('x',x,'y',y)
        resizeCanvas();
        resetPosition();
      } else {
        document.documentElement.requestFullscreen();
    }

}

// Blur the focus so when we pause, we don't keep pressing buttons
document.addEventListener("focus", (e) => {
    document.activeElement.blur()
  }, true);

function reloadPage(){
    if (document.fullscreenElement) {
        document.exitFullscreen();
        resizeCanvas();
        resetPosition();
    }
    setTimeout(() => {location.reload();},10);
}

