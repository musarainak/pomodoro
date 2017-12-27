"use strict";

// aldagai orokorrak zehaztu
var pause = true;
var reset = false;
var finish = false;

window.onload = function () {
  // store (gordetako balioak eskuratu)
  if (!localStorage.storeMinutes) {
    localStorage.storeMinutes = 25;
  };
  if (!localStorage.storeAlarm) {
    localStorage.storeAlarm = 'alarm-submarine';
  };
  document.getElementById("timer").innerHTML = localStorage.storeMinutes + ":00";
  document.getElementById("customMinutes").value = localStorage.storeMinutes;

  // selected klasea gehitu klikatutako elementuari
  var elements = document.querySelectorAll('.alarm__check');
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute('data-alarm') == localStorage.storeAlarm) {
      elements[i].classList.add('selected');
    }
  }
};

// Push.Permission.request();
var notifyMe = function notifyMe() {
  Push.create('Ieeeepa!!!', {
    body: 'Hartu deskantsu txiki bat ;)',
    icon: 'icon.png',
    timeout: 8000, // Timeout before notification closes automatically.
    vibrate: [100, 100, 100], // An array of vibration pulses for mobile devices.
    onClick: function onClick() {
      console.log(this); // Callback for when the notification is clicked.
    }
  });
};

var checkSettingInput = function checkSettingInput() {
  var el = document.getElementById('pause'),
      elSettings = document.getElementById('settings'),
      customMinutes = document.getElementById("customMinutes").value,
      customSound = document.querySelector('.alarm__check.selected');

  // zenbaki bat dela bermatu
  if (isNaN(customMinutes) || customMinutes == " ") {
    alert('Erabili zenbakiak mesedez');
    return false;
  } else {
    document.querySelector('.reset').style.display = "block";
    document.getElementById("timer").innerHTML = customMinutes + ":00";

    // store (gorde balio pertsonalizatuak hurrengo bisitetarako)
    localStorage.storeMinutes = customMinutes;
    localStorage.storeAlarm = customSound.getAttribute('data-alarm');

    // klikatzen den lehen aldia ez bada finish true jarri (clearInterval ekiditzeko)
    if (!elSettings.classList.contains('is-active')) {
      finish = true;
    }

    // datuen jasotzea ondo joan bada martxan jarri (reset eta pause)
    reset = false;
    pause = true;
    resetAll();

    // lehen aldiz klikatu dela bermatu (is-active klasea gehitu ezarpenak eta play botoiei)
    elSettings.classList.add('is-active');
    el.classList.add('is-active');
  }
};

var resetAll = function resetAll() {
  var el = document.getElementById('pause'),
      customSound = new Audio("dist/sounds/" + localStorage.storeAlarm + ".mp3");

  // gordetako denbora jaso eta erakutsi
  document.getElementById("timer").innerHTML = localStorage.storeMinutes + ":00";
  el.disabled = true;
  el.innerHTML = "<span class='icon-play'></span>";

  // guztia 0an jarri (reset eta pause)
  reset = true;
  pause = true;
  countTimers(localStorage.storeMinutes, customSound);
};

var startAll = function startAll() {
  var customSound = new Audio("dist/sounds/" + localStorage.storeAlarm + ".mp3");
  document.getElementById("timer").innerHTML = localStorage.storeMinutes + ":00";

  // guztia 0an jarri baina pausari gabe (reset eta pause)
  reset = true;
  pause = false;
  countTimers(localStorage.storeMinutes, customSound);
};

var countTimers = function countTimers(minutes, sound) {
  var el = document.getElementById('pause'),
      elReset = document.getElementById('reset'),
      customSound = sound,
      mainSeconds = 60,
      mins = minutes - 1,
      seconds = mainSeconds,
      counter = setInterval(timer, 1000),


  //svg balioak
  time = mainSeconds * minutes,
      i = 1,
      initialOffset = '1256';

  // set interval funtzioa (buklea)
  function timer() {
    setTimeout(function () {
      elReset.disabled = false;
    }, 0);

    //reset TRUE bada
    if (reset) {
      reset = false;
      document.querySelector('.circle__animation').style.strokeDashoffset = 1256;

      //finish FALSE bada
      if (!finish) {
        clearInterval(counter);
      }

      finish = false;
      setTimeout(function () {
        el.disabled = false;
      }, 0);
    }

    // pausarik ez bada buklea jarraitu
    if (!pause) {
      seconds--;
      if (seconds == 0 && mins < 1) {
        clearInterval(counter);
        finish = true;
        seconds = 0;
        customSound.play();
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
      document.querySelector('.circle__animation').style.strokeDashoffset = initialOffset - i * (initialOffset / time);
      i++;
    }
  }
  return;
};

document.addEventListener('click', function (event) {

  event.preventDefault();

  if (event.target.id == "settings") {
    checkSettingInput();
  }

  if (event.target.id == "reset") {
    resetAll();
  }

  //play/pause botoia duda
  if (event.target.id == "pause") {

    if (pause == false) {
      pause = true;
      event.target.innerHTML = "<span class='icon-play'></span>";
    } else {
      pause = false;
      event.target.innerHTML = "<span class='icon-pause'></span>";

      if (!event.target.classList.contains('is-active')) {
        finish = false;
        startAll();
        event.target.classList.add('is-active');
        document.getElementById("settings").classList.add('is-active');
      }
    }

    reset = false;
    document.getElementById("reset").disabled = true;
    event.target.classList.toggle("is-play");
  }

  // panela zabaldu/itxi
  if (event.target.id == "icon-close") {
    document.querySelector('aside.panel').classList.remove('is-open');
  } else if (event.target.id == "icon-settings") {
    document.querySelector('aside.panel').classList.add('is-open');
  }

  if (event.target.classList.contains('alarm__check')) {
    var elements = document.querySelectorAll('.selected');
    // remove class to all chosen elements
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
  }
}, false);