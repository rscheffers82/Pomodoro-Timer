// Javascript
$( document ).ready(function() {
 

});

// global vars for the canvas
var c;
var ctx
var degrees = -1;				// used for rotating goes to 0 after the initial call
var rotate = 0;
var raf;
c = document.querySelector('#c');
if ( !c.getContext ) error('no canvas');	// break script when canvas s not supported or can be found

// assign canvas context, and scale appropriately
ctx = c.getContext('2d');
ctx.scale(0.8,0.8);
ctx.translate(-15,-15);

var error = function(message){
	console.log(message);
	// display error on screen 
}

// draw functions
var drawTop = function(lwidth, strokeStyle, fillStyle,degrees){
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
 }
var drawBottom = function(lwidth, strokeStyle, fillStyle,degrees){
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
}

var drawSand = function(fillStyle){
	//ctx.fillStyle = '222223';//fillStyle;
	ctx.fillRect(197,195,11,154);
	//ctx.fill();
}

function rotateSandTimer(top, bottom){
 	var result = document.getElementById('result');
 	var fillStyle;
 	//result.textContent = Number(result.textContent) + 1;
 	degrees += 1;
 	
	ctx.clearRect(0, 0, 400, 400);
	ctx.save();
	ctx.translate(200, 200);					// go to the center of the canvas, x,y 200, 200.
	ctx.rotate(degrees * Math.PI / 180);
	ctx.translate(-200, -200);

	fillStyle = top 								// fill color for the upper part of the sand timer'#fafafc';
	drawTop(7, '#2222aa', fillStyle, degrees);
	drawTop(3, '#fafafc', fillStyle, degrees);
	
	fillStyle = bottom 								// fill color for the bottom part of the sand timer //'#CBBD99';
	drawBottom(7, '#2222aa', fillStyle, degrees);
	drawBottom(3, '#fafafc', fillStyle, degrees);
	
	// draw the opening	between the top and bottom
	ctx.fillStyle = '#fafafc';
	ctx.fillRect(195,197,15,6);
	//drawSand(fillStyle);
	ctx.restore();

 	console.log('rotate:', degrees);
 	//if ( degrees <= 180 ) 
 	rotateSandTimer(top,bottom); //clearInterval(rotate);
 }

 // event handlers

$('#c').click(function(){

});

	raf = window.requestAnimationFrame(rotateSandTimer('#fafafc','#CBBD99'));
//rotate = window.setInterval(rotateSandTimer('#fafafc','#CBBD99'), 1);

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

/*
	//ctx.fill();
	ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the position back to 0,0
*/


	/* adding shadow
  	ctx.shadowOffsetX = 5;
  	ctx.shadowOffsetY = 5;
  	ctx.shadowBlur = 10;
  	ctx.shadowColor = "DarkGoldenRod";
	*/