// Length Control function to handle increment and decrement of session and break lengths
function lengthControl(e, t, n, i) {
  if (timerState !== "running") {
    if (timerType === i) {
      if (t === "-" && n !== 1) {
        e === "brkLength" ? (brkLength = n - 1) : (seshLength = n - 1);
      } else if (t === "+" && n !== 60) {
        e === "brkLength" ? (brkLength = n + 1) : (seshLength = n + 1);
      }
    } else if (t === "-" && n !== 1) {
      e === "brkLength" ? (brkLength = n - 1) : (seshLength = n - 1);
      timer = e === "brkLength" ? 60 * (brkLength - 1) : 60 * (seshLength - 1);
    } else if (t === "+" && n !== 60) {
      e === "brkLength" ? (brkLength = n + 1) : (seshLength = n + 1);
      timer = e === "brkLength" ? 60 * (brkLength + 1) : 60 * (seshLength + 1);
    }
  }
  displayLengths();
}

// Timer Control function to start or stop the timer
function timerControl() {
  if (timerState === "stopped") {
    beginCountDown();
    timerState = "running";
  } else {
    timerState = "stopped";
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
    }
  }
}

// Begin the countdown timer
function beginCountDown() {
  intervalID = setInterval(function () {
    decrementTimer();
    phaseControl();
  }, 1000);
}

// Decrement the timer by 1 second
function decrementTimer() {
  timer--;
  displayTimeLeft();
}

// Control the different phases (session and break) of the timer
function phaseControl() {
  if (timer < 0) {
    if (timerType === "Session") {
      intervalID && clearInterval(intervalID);
      beginCountDown();
      switchTimer(60 * brkLength, "Break");
    } else {
      intervalID && clearInterval(intervalID);
      beginCountDown();
      switchTimer(60 * seshLength, "Session");
    }
  }
  warning();
  buzzer();
}

// Warning function to change alarm color when the time is below 1 minute
function warning() {
  if (timer < 61) {
    alarmColor = { color: "#a50d0d" };
  } else {
    alarmColor = { color: "white" };
  }
  displayTimeLeft();
}

// Buzzer function to play a sound when the timer reaches zero
function buzzer() {
  if (timer === 0) {
    const beepSound = new Audio(
      "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    );
    beepSound.play();
  }
}

// Switch the timer to the given time and type (Session or Break)
function switchTimer(e, t) {
  timer = e;
  timerType = t;
  alarmColor = { color: "white" };
  displayTimeLeft();
}

// Format the timer in mm:ss format
function clockify() {
  if (timer < 0) return "00:00";
  const minutes = Math.floor(timer / 60);
  const seconds = timer - minutes * 60;
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds
  );
}

// Reset the timer and lengths to default values
function reset() {
  brkLength = 5;
  seshLength = 25;
  timerState = "stopped";
  timerType = "Session";
  timer = 1500;
  intervalID && clearInterval(intervalID);
  intervalID = null;
  alarmColor = { color: "white" };
  displayLengths();
  displayTimeLeft();
		const audioBeep = document.getElementById("beep");
		audioBeep.pause();
		audioBeep.currenTime = 0;
}

// Display the session and break lengths
function displayLengths() {
  document.getElementById("break-length").innerText = brkLength;
  document.getElementById("session-length").innerText = seshLength;
}

// Display the time left in the timer
function displayTimeLeft() {
  document.getElementById("timer-label").innerText = timerType;
  document.getElementById("time-left").innerText = clockify();
  document.getElementById("time-left").style.color = alarmColor.color;
}

// Attach click event listeners to buttons
document.getElementById("break-decrement").addEventListener("click", function () {
  lengthControl("brkLength", "-", brkLength, "Session");
});
document.getElementById("break-increment").addEventListener("click", function () {
  lengthControl("brkLength", "+", brkLength, "Session");
});
document.getElementById("session-decrement").addEventListener("click", function () {
  lengthControl("seshLength", "-", seshLength, "Break");
});
document.getElementById("session-increment").addEventListener("click", function () {
  lengthControl("seshLength", "+", seshLength, "Break");
});
document.getElementById("start_stop").addEventListener("click", timerControl);
document.getElementById("reset").addEventListener("click", reset);

// Initialize default values and display
let brkLength = 5;
let seshLength = 25;
let timerState = "stopped";
let timerType = "Session";
let timer = 1500;
let intervalID = null;
let alarmColor = { color: "white" };
displayLengths();
displayTimeLeft();
