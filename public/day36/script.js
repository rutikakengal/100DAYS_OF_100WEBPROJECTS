var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

$(document).keypress(function () {
  if (!started) {
    $("h1").text("Level : " + level);
    nextSequence();
    started = true;
  }
});

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
$(".btn").click(function (event) {
  var userChoosenColor = $(event.target).attr("id");
  userClickedPattern.push(userChoosenColor);

  playSound(userChoosenColor);
  console.log(userClickedPattern);
  animatePress(userChoosenColor);
  checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
  userClickedPattern = [];
  level++; //shows level 1 when restarted.
  $("#level-title").text("Level : " + level);
  //level++;  if u add here it shows from level 0 as first level
  var randomNumber = Math.floor(Math.random() * 3) + 1;

  var randomChoosenColor = buttonColors[randomNumber];

  gamePattern.push(randomChoosenColor);
  console.log(gamePattern);

  $("#" + randomChoosenColor)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  //animatePress(randomChoosenColor);
  playSound(randomChoosenColor);
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] == userClickedPattern[currentLevel]) {
    console.log("Success");

    if (userClickedPattern.length == gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    console.log("Wrong");
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 250);

    $("h1").text("GAME-OVER,Press any key to Restart");
    startOver();
  }
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColor) {
  var activeButton = $("." + currentColor);
  activeButton.addClass("pressed");
  setTimeout(function () {
    activeButton.removeClass("pressed");
    //.classList.remove use this if u write document.query..explicitly else .remove Class
  }, 150);
}

const guideBtn = document.getElementById("guideBtn");
const guideBox = document.getElementById("guideBox");
const closeBtn = document.getElementById("closeGuide");

guideBtn.addEventListener("click", () => {
  guideBox.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  guideBox.style.display = "none";
});
