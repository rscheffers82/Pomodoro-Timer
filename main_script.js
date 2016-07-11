// Javascript

$('document').ready(function(){
	sandTimer.init();
});

var sandTimer = (function(){
	var c;					// canvas element
	var ctx;				// canvas context

	var workTime;			// time to work in minutes
	var breakTime;			// time for break in minutes
	var workBreak;			// in which cycle are we? ('work' / 'break' values)
	var cycleEnd;			// end of work or break time

	var timerRunning = false; // used for pauzing the timer
	var secondsPassed = 0;	// running count to keep track of work and break time
	var loop;				// timer, used for tracking time, work and break time

	var degrees = 0;		// at what angle is the sand timer
	
	// private functions
	var disableSliders = function(disable){
	 	if( disable ){
	 		$('.choice').attr('disabled', true);
	 		$('.choice').addClass('disabled');
	 	} else {
	 		$('.choice').attr('disabled', false);
	 		$('.choice').removeClass('disabled');
	 		console.log('disabled');
	 	}
	 }

	 var clearCanvas = function(){
		//console.log('clearCanvas - degrees: ', degrees);
		ctx.clearRect(0, 0, 400, 400);
		ctx.translate(200, 200);						// go to the center of the canvas, x,y 200, 200.
		ctx.rotate(degrees * Math.PI / 180);			// rotate depending on the timer
		ctx.translate(-200, -200);						// go back to position 0,0 > top, left
	}

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
		// draw the opening	between the top and bottom
		ctx.fillStyle = '#fafafc';
		ctx.fillRect(186, 196, 28, 8);
	}

	var render = function(fill, rotate){
		console.log('render - fill: ',fill);

		ctx.save();
		clearCanvas();

		fill *= 1.5;								// 100% = 150 pixels on the canvas

		// line thickness, stroke, fill
		drawTop(10, '#222223');						// outer layer
		drawTop(7, '#fafafc', '#fafafc');			// inner white layer, sand separator
		ctx.save();									// save state so we can go back to it after clipping

		// draw sand in the top
		ctx.clip();
		ctx.fillStyle = '#d2d233';
		ctx.fillRect(0, 50+fill, 400, 150-fill);	// 100% full (start 50, end 200), 0
		ctx.restore();	

		drawBottom(10, '#222223');
		drawBottom(7, '#fafafc', '#fafafc');
		ctx.save();

		// draw sand in the bottom
		ctx.clip();
		ctx.fillStyle = '#d2d233';
		ctx.fillRect(0, 350-fill, 400, 0+fill);	// 100% full (start 200, end 350), 0
		ctx.restore();

		ctx.save();
		fill /= 1.5;
		if ( fill > 1 && fill < 100 ) {
			ctx.fillStyle = '#d2d233';
			ctx.fillRect(193, 195, 14, 155);
		}
		ctx.restore();
		// draw falling sand
		/*	
		fill /= 1.5;
		ctx.fillStyle = '#d2d233';
		if ( !rotate && fill === 1 ){
			console.log('fill 0');
			var level = 0;
			var fall = window.setInterval(fallingSand, 25);
			function fallingSand(){
				//ctx.fillStyle = '#d2d233';
				ctx.fillRect(193, 195, 14, level);
				level += 5;
				if ( level > 155 ) window.clearInterval(fall);
			}
		} else if ( !rotate && fill >= 100 ){
			window.clearInterval(loop);			// stop the timer
			//ctx.fillStyle = '#d2d233';
			ctx.fillRect(193, 195, 14, 10);
			var fall = window.setInterval(fallingSand, 200);
			var level = 0;
			function fallingSand(){
				console.log('falling sand, level', level);
				//ctx.fillStyle = '#fafafc';
				ctx.fillRect(193, 195, 14, level);
				level++;
				if ( level > 7 ) {
					window.clearInterval(fall);

				}
			}
			//	ctx.fillRect(193, 195, 14, 155);
			console.log('fill 100');
			//}
		} else if ( !rotate && fill > 1 && fill < 100 ) {
			ctx.fillRect(193, 195, 14, 155);
			console.log('fill ',fill);
		}
*/
		ctx.restore();
	 }

	 var resetTimer = function() {	// used only once for imidiate reset when the sliders are used
		if ( secondsPassed > 0 ) {  
			secondsPassed = 0;
			workBreak = 'work';
			render(0, false);
		}
	}

	var rotateTimer = function() {
		var animation180 = window.setInterval(turn, 30);

		function turn() {
			//console.log('degrees: ', degrees);
			if ( degrees >= 180 ) {
				clearInterval(animation180); 
				degrees = 0; 
				render(0, false);				// display the initial state of the timer
			} else{
				render(100, true);				// 100%, rotate set to true
				degrees += 5;
			}
		}
	}

	var switchStartBreak = function() {
		console.log('switchStartBreak - workBreak: ', workBreak);
		// rotate timer
		rotateTimer();
		
		// reset core vars and alternate between work / break
		workBreak = workBreak === 'work' ? 'break' : 'work';
		cycleEnd = workBreak === 'work' ? workTime * 60 : breakTime * 60;
		secondsPassed = 0;
		//console.log('switchStartBreak - workBreak: ', workBreak);		//debug
	}

	function mainLoop(){		
		// still time to go until the end?
		if ( secondsPassed < cycleEnd ){
			secondsPassed += 0.250 * 100;								// 250 milisecond interval
			var sandLevel = Math.round( ( secondsPassed / cycleEnd ) * 100 );
			render( sandLevel );
		} else {
			// end of the cycle, turn timer and start with the break
			timerRunning = false;
			window.clearInterval(loop)
			switchStartBreak();
			window.setTimeout(function(){ 
				sandTimer.startStop(); 
			}, 1000) // wait 1 sec for rotation to finish and restart the timer
		}

	}

// public functions
	
	return{
	init: function(){
		c = document.querySelector('#c');
		//if ( !c.getContext ) error('no canvas'); return	// break script when canvas s not supported or can be found

		// assign canvas context, and scale appropriately
		ctx = c.getContext('2d');
		ctx.scale(0.8,0.8);
		ctx.translate(-15,-15);

	 	this.updateWorkTime(25);
	 	this.updateBreakTime(5);
	 	degrees = 0;
	 	workBreak = 'work';
		cycleEnd = workTime * 60; 	 	// assign cycle the work value
	 	render(0, false);
	 },
	error: function(message){
		//console.log(message);
		// display error on screen 
	},
	startStop: function(){

		if (!timerRunning) {			// start or continue
			timerRunning = true;
			disableSliders(true);
			loop = window.setInterval(mainLoop, 250);		// 250 milisecond interval
		} else 	{ 						// pauze
			timerRunning = false;
			disableSliders(false);
			window.clearInterval(loop)
		}
	 },
	 updateWorkTime: function(value){
	 	// when timer is paused, and sliders are adjusted, reset timer.
	 	resetTimer();

	 	workTime = value;
	 	cycleEnd = value * 60;			// assign cycleEnd the work value as timer has been reset
	 	return workTime;

	 },
	 updateBreakTime: function(value){
	 	// when timer is paused, and sliders are adjusted, reset timer.
	 	resetTimer();

	 	breakTime = value;
		return breakTime;
	 },
	}
})();
// event handlers

$('#c').click(function(){
	sandTimer.startStop();
	//sandTimer.rotateTimer();
});

$('#wt').on('input', function(){
	$('.worktime').text( sandTimer.updateWorkTime(this.value) );
});

$('#bt').on('input', function(){
	$('.breaktime').text( sandTimer.updateBreakTime(this.value) );
});

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