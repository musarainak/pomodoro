'use strict';

var el = document.getElementById('pause');
var elSettings = document.getElementById('settings');
var elReset = document.getElementById('reset');
var pause = true;
var reset = false;
var finish = false;
var selectedSound = document.querySelector('.alarm__item.selected');
var setMinutes = document.getElementById("minutes");
var trySound = new Audio();

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('alarm__item')) {

    //console.dir(event.target);

    var elements = document.querySelectorAll('.selected');
    // remove class to all chosen elements
    for (var i = 0; i < elements.length; i++) {

      elements[i].classList.remove('selected');
    }

    event.target.classList.add('selected');
  }
}, false);

function checkSettingInput() {

  reset = false;
  pause = true;
  var x = document.getElementById("customMinutes").value;

  selectedSound = document.querySelector('.alarm__item.selected');

  var snd = new Audio("dist/sounds/" + selectedSound.getAttribute('data-alarm') + ".mp3");

  document.getElementById("timer").innerHTML = x + ":00";

  if (isNaN(x) || x == "") {
    alert('Erabili zenbakiak mesedez');
    return false;
  } else {
    document.querySelector('.reset').style.display = "block";
    elSettings.disabled = true;
    countTimers(x, snd);
  }
}

function resetAll() {

  reset = true;
  pause = true;
  el.disabled = true;
  var x = document.getElementById("customMinutes").value;

  selectedSound = document.querySelector('.alarm__item.selected');

  var snd = new Audio("dist/sounds/" + selectedSound.getAttribute('data-alarm') + ".mp3");

  document.getElementById("timer").innerHTML = x + ":00";
  countTimers(x, snd);

  el.innerHTML = "<span class='icon-play'></span>";
}

function countTimers(minutes, sound) {

  var snd = sound;
  var mainSeconds = 60;
  var mins = minutes - 1;
  var seconds = mainSeconds;
  var counter = setInterval(timer, 1000);

  function timer() {

    setTimeout(function () {
      elReset.disabled = false;
    }, 1000);

    if (reset) {
      pause = true;
      reset = false;

      if (!finish) {
        clearInterval(counter);
      }
      setTimeout(function () {
        el.disabled = false;
      }, 1000);
    }

    if (!pause) {
      //jarraitu pausarik ez bada


      seconds--;

      if (seconds < 0) {

        seconds = mainSeconds - 1;
        if (mins > 0) {
          mins--;
        } else {
          clearInterval(counter);
          finish = true;
          seconds = 0;
          snd.play();
          el.innerHTML = "Hasi!";
          notifyMe();
        }
      }

      document.getElementById("timer").innerHTML = mins.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
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
  }
  reset = false;
  elReset.disabled = true;
  el.classList.toggle("is-play");
});

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('alarm__check')) {

    trySound.pause();
    trySound = new Audio("dist/sounds/" + event.target.attributes["data-alarm"].value + ".mp3");
    trySound.play();
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