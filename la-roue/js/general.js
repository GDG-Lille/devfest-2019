// LINKRAY DEMO

window.onload = function(e) {

  const zStart = document.getElementById('start');
  const zWheel = document.getElementById('theWheel');
  const spinSound = new Audio('img/spinning.wav');
  const blinSound = new Audio('img/chime.mp3');
  var aStep = 10;
  var randomic;

  function rotate(r) {
    aStep = aStep + 10;
    if(aStep > r) {
      clearInterval();
      spinSound.pause();
    } else {
      zWheel.style.transform = `rotate(${aStep}deg)`;
    }
  }

  zStart.addEventListener('click', function(event) {
    event.preventDefault();
    aStep = 10;
    randomic = Math.floor(Math.random() * (1000 - 10)) + 10;
    spinSound.play();
    setInterval(function() {rotate(randomic)}, 100);
  });

}
