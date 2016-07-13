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
	var bellSound = new Audio('audio/small-bell.wav');

	// private functions
	var error = function(message){
		console.log(message);
	}

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
		//console.log('render - fill: ',fill);

		ctx.save();
		clearCanvas();

		fill *= 1.5;								// 100% = 150 pixels container size on the canvas

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

		// draw falling sand
		ctx.save();
		fill /= 1.5;
		if ( timerRunning && fill > 0 && fill < 100 ) {
			ctx.fillStyle = '#d2d233';
			ctx.fillRect(195, 195, 10, 155);
		}
		ctx.restore();

		ctx.restore();
	 }

	 var resetTimer = function() {	// used only once for imidiate reset when the sliders are used
		if ( secondsPassed > 0 ) {  
			secondsPassed = 0;
			workBreak = '';
			setActive();
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

	var setActive = function(){
		if ( workBreak === 'work') {
			$('.break').removeClass('active');
			$('.work').addClass('active');
		} else if (workBreak === 'break') {
			$('.work').removeClass('active');
			$('.break').addClass('active');
		} else {
			$('.work').removeClass('active');
			$('.break').removeClass('active');
		}
	}

	var switchStartBreak = function() {
		rotateTimer();
		
		// reset core vars and alternate between work / break
		workBreak = workBreak === 'work' ? 'break' : 'work';
		cycleEnd = workBreak === 'work' ? workTime * 60 : breakTime * 60;
		secondsPassed = 0;
		setActive();
		//console.log('switchStartBreak - workBreak: ', workBreak);		//debug
		// CSS styling for work or break

	}

	function mainLoop(){		
		// still time to go until the end?
		if ( secondsPassed < cycleEnd ){
			secondsPassed += 0.250*1000;								// 250 milisecond interval
			var sandLevel = ( secondsPassed / cycleEnd ) * 100;
			render( sandLevel );
		} else {
			// end of the cycle, turn timer and start with the break or new work round
			timerRunning = false;
			window.clearInterval(loop)
			bellSound.play();
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
		//if ( !c.getContext ) error('your device / browser does not support a canvas'); break	// break script when canvas s not supported or can be found

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
	startStop: function(){
		if (!timerRunning) {			// start or continue
			timerRunning = true;
			disableSliders(true);
			setActive();
			loop = window.setInterval(mainLoop, 250);		// 250 milisecond interval
		} else 	{ 						// pauze
			timerRunning = false;
			disableSliders(false);
			// Time-out in 250 sec and stop the loop to draw the timer once more but now without the falling sand
			window.setTimeout(function() {
				window.clearInterval(loop)
			}, 250);
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

// fill animation example: http://stackoverflow.com/questions/23460873/how-can-i-fill-canvas-shape-with-animation
// jsfiddle: http://jsfiddle.net/jM4hW/18/