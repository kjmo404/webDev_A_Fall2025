// w3schools 

var i = 0;
var txt = 'The\nSocial\nDilemma';
var speed = 40;

function typeWriter() {
  if (i < txt.length) {
    const char = txt.charAt(i);
    document.getElementById("demo").innerHTML += char === '\n' ? '<br>' : char;
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = function() {
  const vibeSound = document.getElementById("vibeSound");
  const smartphone = document.querySelector(".smartphone");
  const screen = document.getElementById("phoneScreen");
  let soundInterval;
  let resumeTimer;

  function startVibration() {
    if (!soundInterval) {
      soundInterval = setInterval(() => {
        vibeSound.currentTime = 0;
        vibeSound.play();
      }, 500);
    }
    smartphone.style.animationPlayState = "running";
    screen.classList.add("glow"); // glow when vibrating
  }

  function stopVibration() {
    clearInterval(soundInterval);
    soundInterval = null;
    smartphone.style.animationPlayState = "paused";
    screen.classList.remove("glow"); // remove glow
    screen.style.background = "white"; // screen white on hover
    // start typewriter effect when hovered
    typeWriter();
  }

  smartphone.addEventListener("mouseenter", () => {
    stopVibration();
    clearTimeout(resumeTimer);
  });

  smartphone.addEventListener("mouseleave", () => {
    resumeTimer = setTimeout(() => {
      startVibration();
      screen.style.background = "black"; // back to black
      document.getElementById("demo").innerHTML = ""; // reset text
      i = 0; // reset typewriter index
    }, 3000);
  });

  // Start vibrating initially
  startVibration();
};
