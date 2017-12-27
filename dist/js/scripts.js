'use strict';

var el = document.getElementById('pause');
var elSettings = document.getElementById('settings');
var elReset = document.getElementById('reset');
var pause = true;
var reset = false;
var finish = false;
var selectedSound = document.querySelector('.alarm__check.selected');
var setMinutes = document.getElementById("customMinutes");

//store
localStorage.storeMinutes = 25;
localStorage.storeAlarm = 'alarm-submarine';

window.onload = function () {

  document.getElementById("timer").innerHTML = localStorage.storeMinutes + ":00";

  document.getElementById("customMinutes").value = localStorage.storeMinutes;

  var elements = document.querySelectorAll('.alarm__check');
  // remove class to all chosen elements
  for (var i = 0; i < elements.length; i++) {

    if (elements[i].getAttribute('data-alarm') == localStorage.storeAlarm) {
      elements[i].classList.add('selected');
    }
  }
};

//console.log(document.querySelector( 'alarm__item' ).getAttribute('data-alarm') ));


function checkSettingInput() {

  reset = false;
  pause = true;
  var x = document.getElementById("customMinutes").value;

  selectedSound = document.querySelector('.alarm__check.selected');

  var snd = new Audio("dist/sounds/" + selectedSound.getAttribute('data-alarm') + ".mp3");

  document.getElementById("timer").innerHTML = x + ":00";

  if (isNaN(x) || x == "") {
    alert('Erabili zenbakiak mesedez');
    return false;
  } else {
    document.querySelector('.reset').style.display = "block";

    //store
    localStorage.storeMinutes = x;
    localStorage.storeAlarm = selectedSound.getAttribute('data-alarm');

    if (!elSettings.classList.contains('is-active')) {
      finish = true;
    }

    resetAll();

    elSettings.classList.add('is-active');
    el.classList.add('is-active');
  }
}

function resetAll() {

  reset = true;
  pause = true;
  el.disabled = true;

  el.innerHTML = "<span class='icon-play'></span>";

  var snd = new Audio("dist/sounds/" + localStorage.storeAlarm + ".mp3");

  document.getElementById("timer").innerHTML = localStorage.storeMinutes + ":00";
  countTimers(localStorage.storeMinutes, snd);
}

function startAll() {

  reset = true;
  pause = false;
  var snd = new Audio("dist/sounds/" + localStorage.storeAlarm + ".mp3");

  document.getElementById("timer").innerHTML = localStorage.storeMinutes + ":00";
  countTimers(localStorage.storeMinutes, snd);
}

function countTimers(minutes, sound) {

  var snd = sound;
  var mainSeconds = 60;
  var mins = minutes - 1;
  var seconds = mainSeconds;
  var counter = setInterval(timer, 1000);

  var time = mainSeconds * minutes + 1;
  var i = 1;
  var initialOffset = '1256';

  function timer() {

    setTimeout(function () {
      elReset.disabled = false;
    }, 0);

    if (reset) {
      reset = false;
      document.querySelector('.circle__animation').style.strokeDashoffset = 1256;

      if (!finish) {
        //is false
        clearInterval(counter);
        finish = false;
      }
      finish = false;
      setTimeout(function () {
        el.disabled = false;
      }, 0);
    }

    if (!pause) {
      //jarraitu pausarik ez bada

      if (i > 1) {

        if (seconds == 0 && mins < 1) {
          clearInterval(counter);
          finish = true;
          seconds = 0;
          snd.play();
          el.disabled = true;
          document.getElementById("timer").innerHTML = mins.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
          notifyMe();
        } else if (seconds < 0) {

          seconds = mainSeconds - 1;
          if (mins > 0) {
            mins--;
          }
        }

        document.getElementById("timer").innerHTML = mins.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
      }

      seconds--;
      document.querySelector('.circle__animation').style.strokeDashoffset = initialOffset - i * (initialOffset / time);
      i++;
    }
  }
  return;
}

elSettings.addEventListener('click', function () {
  checkSettingInput();
});

elReset.addEventListener('click', function () {
  resetAll();
});

el.addEventListener('click', function () {

  if (pause == false) {
    pause = true;
    el.innerHTML = "<span class='icon-play'></span>";
  } else {
    pause = false;
    el.innerHTML = "<span class='icon-pause'></span>";

    if (!el.classList.contains('is-active')) {
      finish = false;
      startAll();
      el.classList.add('is-active');
      elSettings.classList.add('is-active');
    }
  }
  reset = false;
  elReset.disabled = true;
  el.classList.toggle("is-play");
});

document.addEventListener('click', function (event) {

  event.preventDefault();

  if (event.target.id == "icon-close") {
    document.querySelector('aside.panel').classList.remove('is-open');
  } else if (event.target.id == "icon-settings") {
    document.querySelector('aside.panel').classList.add('is-open');
  }

  //console.dir(event.target);

  if (event.target.classList.contains('alarm__check')) {

    var elements = document.querySelectorAll('.selected');
    // remove class to all chosen elements
    for (var i = 0; i < elements.length; i++) {

      elements[i].classList.remove('selected');
    }

    event.target.classList.add('selected');
  }
}, false);

Push.Permission.request();

function notifyMe() {

  Push.create('Ieeeepa!!!', {
    body: 'Hartu deskantsu txiki bat ;)',
    icon: 'icon.png',
    timeout: 8000, // Timeout before notification closes automatically.
    vibrate: [100, 100, 100], // An array of vibration pulses for mobile devices.
    onClick: function onClick() {
      // Callback for when the notification is clicked.
      console.log(this);
    }
  });
}