// Javascript
$( document ).ready(function() {
 

});

var work = window.setInterval(working, 1000);

function working(){
 	var count = 0;

 	var result = document.getElementById('result');
 	result.textContent = count++;
 	console.log(count++);
 }

 