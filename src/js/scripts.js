var el = document.getElementById('pause');
var elSettings = document.getElementById('settings');
var elReset = document.getElementById('reset');
var pause = true;
var reset = false;
var selectedSound = document.querySelector('.alarm__item.selected');
var setMinutes = document.getElementById("minutes");
var trySound = new Audio();

document.addEventListener('click', (event) => {
    if ( event.target.classList.contains( 'alarm__item' ) ) {
        
       //console.dir(event.target);

		var elements = document.querySelectorAll('.selected');
		// remove class to all chosen elements
		for (var i=0; i<elements.length; i++) {

	      elements[i].classList.remove('selected');
	    }

  		event.target.classList.add('selected');

    }
}, false);

function checkSettingInput(){
  let x=document.getElementById("customMinutes").value;
  
  selectedSound = document.querySelector('.alarm__item.selected');
  
  var snd = new Audio("dist/sounds/"+ selectedSound.getAttribute('data-alarm') +".mp3");
  console.log(selectedSound.getAttribute('data-alarm'));
  
  if (isNaN(x) || x == "" ) 
  {
	alert('Erabili zenbakiak mesedez');
    return false;
  }else{
	  document.querySelector('.reset').style.display="block";
	  elSettings.disabled = true;
	  countTimers(x, snd);
  }
}

function resetAll(){
	
  reset = true;
  pause = true;
  let x=document.getElementById("customMinutes").value;
  
  selectedSound = document.querySelector('.alarm__item.selected');
  
  var snd = new Audio("dist/sounds/"+ selectedSound.getAttribute('data-alarm') +".mp3");

  document.getElementById("timer").innerHTML = document.getElementById("customMinutes").value+":00";
  countTimers(document.getElementById("customMinutes").value, snd);
  el.innerHTML ="Hasi!";
  
}

function countTimers(minutes, sound) {

  var snd = sound;
  var mainSeconds = 3;
  var mins = minutes-1;
  var seconds = mainSeconds;
  var counter = setInterval(timer, 1000);
  
	
  function timer() {
	  
	  if(reset){
		  clearInterval(counter);
	     reset = false;
	     pause = true;
	  }
    if (!pause) { //jarraitu pausarik ez bada
      seconds--;
      if (seconds < 0) {
	      seconds = mainSeconds;
      	if( mins > 0 && !reset ) {
		  mins--;
		}else{
	      clearInterval(counter);
	      snd.play();
	      el.innerHTML ="Hasi!";
	      notifyMe();
      	}
        
     }else {
	     document.getElementById("timer").innerHTML = mins.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
	 }
	}
  }
}

elSettings.addEventListener('click', () => { checkSettingInput(); });

elReset.addEventListener('click', () => { resetAll();  });

el.addEventListener('click', () => {
	
	if(pause==false) {
		pause = true;
		reset = false;
		el.innerHTML ="Segi!";
		
	}else{
		pause = false;	
		reset = false;
		el.innerHTML ="Gelditu!";
		elReset.disabled=false;
	}
	
	el.classList.toggle("is-play");
	
});

document.addEventListener('click', (event) => {
    if ( event.target.classList.contains( 'alarm__check' ) ) {
	    
	    trySound.pause();
        trySound = new Audio("dist/sounds/"+ event.target.attributes["data-alarm"].value +".mp3");
        trySound.play();

    }
}, false);


Push.Permission.request();

function notifyMe() {
  
  Push.create('Ieeeepa!!!', {
    body: 'Hartu deskantsu txiki bat ;)',
    icon: 'icon.png',
    timeout: 8000,               // Timeout before notification closes automatically.
    vibrate: [100, 100, 100],    // An array of vibration pulses for mobile devices.
    onClick: function() {
        // Callback for when the notification is clicked. 
        console.log(this);
    }  
});
}
