// Javascript
$( document ).ready(function() {
 

});

// global vars for the canvas
var c;
var ctx
var degrees = 0;				// used for rotating goes to 0 after the initial call
var animation180;
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
var drawTop = function(lwidth, strokeStyle, fillStyle){
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
var drawBottom = function(lwidth, strokeStyle, fillStyle){
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

var drawTopSand = function(fillStyle){
	//ctx.fillStyle = '222223';//fillStyle;
	//ctx.fillRect(197,195,11,154);
	//ctx.fill();
}

function startSandTimer(){
	ctx.save();
	clearCanvas();
	// line thickness, stroke, fill
	drawTop(10, '#222223');						// outer layer
	drawTop(7, '#fafafc', '#fafafc');			// inner white layer, sand separator
	ctx.save();									// save state so we can go back to it after clipping
	ctx.clip();
	
	// draw sand in the top
	ctx.fillStyle = '#d2d233';
	//ctx.fillRect(0,90,400,200);
	ctx.fillRect(0,50,400,150);			// 100% full
	ctx.restore();	

	drawBottom(10, '#222223');
	drawBottom(7, '#fafafc', '#fafafc');
	ctx.save();
	ctx.clip();

	// draw sand in the bottom
	ctx.fillStyle = '#d2d233';
	//ctx.fillRect(0,250,400,150);
	ctx.fillRect(0,200,400,150);			// 100% full

	// draw the opening	between the top and bottom
	ctx.restore();
	ctx.fillStyle = '#fafafc';
	ctx.fillRect(186, 196, 28, 8);
	ctx.fillStyle = '#d2d233';
	ctx.fillRect(193, 195, 14, 155);
	ctx.restore();
 	degrees += 10;
 	if ( degrees > 180 ) clearInterval(animation180);
}

 function clearCanvas(){
	ctx.clearRect(0, 0, 400, 400);
	ctx.translate(200, 200);						// go to the center of the canvas, x,y 200, 200.
	ctx.rotate(degrees * Math.PI / 180);
	ctx.translate(-200, -200);
}

// event handlers

$('#c').click(function(){
	// first click, start the timer
	degrees = 0;
	clearInterval(animation180);
	animation180 = window.setInterval(startSandTimer, 50);

	// 2nd click, pauze the timer
});

$('#wt').on('input', function(){
	$('.worktime').text(this.value);
});

$('#bt').on('input', function(){
	$('.breaktime').text(this.value);
});

//init values
$('#wt').defaultValue = 25;
$('#bt').defaultValue = 5;
// initial draw at 0 degrees

//rotateSandTimer();
startSandTimer();

//animation180 = window.setInterval(rotateSandTimer, 50);
/*
function working(){
 	var result = document.getElementById('result');
 	//result.textContent = Number(result.textContent) + 1;
 	degrees += 1;
 	rotateTimer(degrees);
 	console.log('rotate:', degrees);
 	if ( degrees >= 180 ) clearInterval(work);
 }
*/
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