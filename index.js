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
        dy = dy * (1 - 2 * Math.random()) + (1 - 2 * Math.random());
        // document.getElementById("no").value= widthShrink;
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
    // dx = Math.abs(dx) - storedDx;
    // dy = Math.abs(dy) - storedDy;
}

const targetDiv = document.getElementById("buttons");

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        if (targetDiv.style.display !== "none") {
            targetDiv.style.display = "none";
            pause();
            
          } else {
            targetDiv.style.display = "block";
            pause();
            
          }
    }
}

// Blur the focus so when we pause, we don't keep pressing buttons
document.addEventListener("focus", (e) => {
    document.activeElement.blur()
  }, true);
  

setInterval(draw, 1);