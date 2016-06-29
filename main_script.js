// Javascript
$( document ).ready(function() {
 

});

var drawTop = function(lwidth, strokeStyle, fillStyle){
	c = document.querySelector('#c');
	//if ( !c.getContext ) console.log('canvas not selected'); return;
	var ctx = c.getContext('2d');
	ctx.lineWidth = lwidth;
	ctx.strokeStyle = strokeStyle;
	ctx.beginPath();
	ctx.moveTo(100,100);
	ctx.lineTo(100,50);
	ctx.lineTo(300,50);
	ctx.lineTo(300,100);
	ctx.arc(200,98,100,0,Math.PI,false); //middle of the circle (200)
	if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
	ctx.stroke();
	ctx.closePath();
/*
	//ctx.fill();
	ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the position back to 0,0
*/
 }
var drawBottom = function(lwidth, strokeStyle, fillStyle){
	c = document.querySelector('#c');
	var ctx = c.getContext('2d');
	ctx.lineWidth = lwidth;
	ctx.strokeStyle = strokeStyle;
	ctx.beginPath();
	ctx.lineTo(100,300);
	ctx.lineTo(100,350);
	ctx.lineTo(300,350);
	ctx.lineTo(300,300);
	ctx.arc(200,302,100, 0, Math.PI, true); //middle of the circle (200)
	if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
	ctx.stroke();
	ctx.closePath();
}

var drawSand = function(fillStyle){
	c = document.querySelector('#c');
	ctx = c.getContext('2d');
	ctx.fillStyle = fillStyle;
	ctx.fillRect(195,195,10,155);
}

var rotateTimer = function(degrees){
	c = document.querySelector('#c');
	ctx = c.getContext('2d');
	ctx.clearRect(0,0, 400, 400);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#222223';	
	ctx.strokeRect(100,50,200,300);
	//ctx.save();
	ctx.translate(200, 200);					// go to the center of the canvas, x,y 200, 200
	ctx.rotate(degrees * Math.PI / 180);
	ctx.translate(-200, -200);					// go back to the zero point
	ctx.strokeStyle = '#fafafc';
	ctx.strokeRect(100,50,200,300);
	//ctx.restore();
	ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the position back to 0,0
	//ctx.width = ctx.width;
}


var fillStyle = '#CBBD99';
var strokeStyle = '#2222aa';
//drawTop(7, '#2222aa', fillStyle);
//drawTop(3, '#fafafc', fillStyle);

fillStyle = '#fafafc';
var strokeStyle = '#fafafc';
//drawBottom(7, '#2222aa', fillStyle);
//drawBottom(3, '#fafafc', fillStyle);

//drawSand('#CBBD99');

var work = window.setInterval(working, 20);
var degrees = 0;

function working(){
 	var result = document.getElementById('result');
 	//result.textContent = Number(result.textContent) + 1;
 	degrees += 1;
 	rotateTimer(degrees);
 	console.log('rotate:', degrees);
 	if ( degrees >= 180 ) clearInterval(work);
 }


// CanvasRenderingContext2D.isPointInPath() could be used for an onclick event to stop the timer
// fill animation: http://stackoverflow.com/questions/23460873/how-can-i-fill-canvas-shape-with-animation
// jsfiddle: http://jsfiddle.net/jM4hW/18/

/* === Commented Javascript for understanding ===

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;
ctx.lineCap = "round";

var y = ch - 10;
var drawingColor = "#0092f9";
animate();

function animate() {

    if (y > 0) {
        requestAnimationFrame(animate);
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    //drawContainer(0, null, null);
    drawContainer(15, drawingColor, null); // outer blue line
    drawContainer(7, "white", "white"); // inner white spacing
    ctx.save();
    ctx.clip();		// ensure that the animation only happens within the shape
    drawLiquid();
    ctx.restore();
    y--; // decreate y so the line moves up

}

function drawLiquid() {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (var x = 0; x < cw; x +=30) {
       ctx.quadraticCurveTo(x + 10, y + 20, x + 30, y); // create the waves top of the water level, top left to top right
    }	
    ctx.lineTo(cw, ch);			// draw a line from the waves to the bottom right
    ctx.lineTo(0, ch);			// draw a line from the bottom right to left bottom corner
    ctx.closePath();				// now we have our square close it
    ctx.fillStyle = drawingColor;		// set color
    ctx.fill();											// fill the rectangle
}

function drawContainer(linewidth, strokestyle, fillstyle) {
    ctx.beginPath();
    ctx.moveTo(109, 15);
    ctx.bezierCurveTo(121, 36, 133, 57, 144, 78);
    ctx.bezierCurveTo(160, 109, 176, 141, 188, 175);
    ctx.bezierCurveTo(206, 226, 174, 272, 133, 284);
    ctx.bezierCurveTo(79, 300, 24, 259, 25, 202);
    ctx.bezierCurveTo(25, 188, 30, 174, 35, 161);
    ctx.bezierCurveTo(53, 115, 76, 73, 100, 31);
    ctx.bezierCurveTo(103, 26, 106, 21, 109, 15);
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = strokestyle;
    ctx.stroke();
    if (fillstyle) {
        ctx.fillStyle = fillstyle;
        ctx.fill();
    }
}

*/