var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
var ballRadius = 40;
var x = Math.max(canvas.width/2,550);
var y = canvas.height/2;
var dx = 0;
var dy = 0;
var ballColor = 'gold' // blue "#0095DD";
var storedDx = 70;
var storedDy = 0.5;
var widthShrink = 0;
var yBounce = 4;
var widthShrinkMultiplier = canvas.width * 0.2;
var mode = 'bounce'
document.getElementById("modeDisplay").innerHTML = mode.charAt(0).toUpperCase() + mode.slice(1);
var blinkDuration = 150; // Duration in milliseconds
var endBlink = 0;
var smoothingFunction;

function modifyWidthShrinkMultiplier(){
    if(canvas.width > 600)
        widthShrinkMultiplier = canvas.width * 0.2;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    if (mode==='bounce' || 'sine'){
        ctx.fillStyle = ballColor;
    }
    ctx.fill();
    ctx.closePath();
}

function bounceMode() {
    mode = 'bounce';
    document.getElementById("modeDisplay").innerHTML = mode.charAt(0).toUpperCase() + mode.slice(1);
}

function blinkMode() {
    mode = 'blink';
    document.getElementById("modeDisplay").innerHTML = mode.charAt(0).toUpperCase() + mode.slice(1);
}

function sineMode() {
    mode = 'sine';
    document.getElementById("modeDisplay").innerHTML = mode.charAt(0).toUpperCase() + mode.slice(1);
}

let runSession = false;
var start;
var offset = canvas.width/2;
var speed = 5;

(function draw(timestamp) {
if (!start) { start = timestamp };
time = timestamp - start;

    if (mode === 'sine'){
        widthShrink =  0.8 * Math.sin(time/500);

        if(runSession){
        x = widthShrink * offset * (Math.cos(time/((10 - Math.min(speed,8.2))*50)) - 0.2 * Math.pow(Math.sin(time/((10 - Math.min(yBounce,9.5))*100)),4)) + offset
        y = (canvas.height / 4) * (Math.cos(time/1000) - 0.2 * Math.pow(Math.sin(time/1000),4)) + canvas.height / 2
        }

        // console.log(time, x, y);

        // Draw the ball (includes clearing the previous frame)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.beginPath();
        drawBall();
        window.requestAnimationFrame(draw);
    }
    else if (mode != 'sine'){

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
                dy = (dy + +yBounce) * (1 - 2 * Math.random());

                // Set the ending time for the blink
                endBlink = timestamp + blinkDuration; // Hit a wall

            }
        }

        // Bounce off top and bottom border
        if(y + dy > canvas.height - +ballRadius || y + dy < +ballRadius) {

            // console.log('Hit y border','y',y,'dy',y)
            dy = -dy;
        }

        // move the ball
        // x += dx;
        smoothingFunction = Math.pow(Math.sin(Math.PI*x/canvas.width),2);
        x += dx * smoothingFunction; // Adding the sin wave makes movement smoother;
        y += dy;

        console.log(x, Math.sin(Math.PI*x/canvas.width),smoothingFunction, 'storedDx', storedDx, 'dx', dx);

        // blink the ball when it hits left/right wall
        if (mode==='blink'){

            widthShrink =  100 * Math.random();
            // widthShrink = widthShrinkMultiplier * Math.random() * 0.5;
            ctx.fillStyle = (endBlink > timestamp ? ballColor : 'transparent');
            x += (endBlink > timestamp ? -dx * smoothingFunction : dx * smoothingFunction);
            y += (endBlink > timestamp ? -dy : dy);
            }

        // change the left and right inner boundaries
        if(runSession & mode==='bounce'){
            widthShrink = widthShrinkMultiplier * Math.random() * Math.random();
        }
        // loop the draw function
        window.requestAnimationFrame(draw);
        // console.log(widthShrink);
    }
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

// Size slider
const sizeSlider = document.getElementById("sizeRange");
const sizeDisplay = document.getElementById("displaySize");
sizeDisplay.innerHTML = sizeSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sizeSlider.oninput = function() {
    sizeDisplay.innerHTML = this.value;
    adjustSize();
}

function adjustSize(){
    ballRadius = sizeSlider.value;
    // console.log(sizeSlider.value,ballRadius);
}

// Bounce slider
const bounceSlider = document.getElementById("bounceRange");
const bounceDisplay = document.getElementById("displayBounce");
bounceDisplay.innerHTML = bounceSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
bounceSlider.oninput = function() {
    bounceDisplay.innerHTML = this.value;;
    adjustYbounce();
}

function adjustYbounce(){
    yBounce = bounceSlider.value;
    // console.log(sizeSlider.value,yBounce);
}

// Speed slider
const speedSlider = document.getElementById("speedRange");
const speedDisplay = document.getElementById("displaySpeed");
speedDisplay.innerHTML = speedSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
speedSlider.oninput = function() {
    speedDisplay.innerHTML = this.value;;
    adjustSpeed();
}

function adjustSpeed(){
    speed = speedSlider.value;
    storedDx = Math.sin(Math.PI*x/canvas.width) * speed * 10;
    // storedDx = Math.max(0,speed * 10) + 1;
    // console.log(speedSlider.value,speed);
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
          dx = storedDx + Math.sin(Math.PI*x/canvas.width);
          dy = storedDy;
          startSession();
          modifyWidthShrinkMultiplier();
        //   widthShrinkMultiplier = 300;
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
    modifyWidthShrinkMultiplier();
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

