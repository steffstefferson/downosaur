var context = null;
var isActing = false;
var isGameOver = false;
var obstacleCheckInterval = null;
var scoreTimes = [];
var cactusCount = 0;
var birdCount = 0;

function checkSite() {
  var canvas = document.getElementsByClassName('runner-canvas');
  if (canvas && canvas[0] && canvas[0].getContext) {
    context = canvas[0].getContext('2d');
    if (context != null) {
      console.log('run downosaur, run!');
      runDownosaurRun();
      return;
    }
  }
  console.log('downosaur extinct!');
}

function checkObstable() {
  if (isActing) return;
  birdCount = cactusCount = 0;
  var cactus = context.getImageData(120, 120, 1, 1);
  var brid = context.getImageData(120, 95, 1, 1);
  var isCactus = cactus.data[0] != 0;
  var isBird = brid.data[0] != 0;
  if (isBird && !isCactus) {
    isActing = true;
    context.fillRect(120, 95, 5, 5);
    console.log('bird!');
    birdCount++;
    dispatchEventDown();
  } else if (isCactus) {
    isActing = true;
    context.fillRect(120, 120, 5, 5);
    console.log('cactus!');
    cactusCount++;
    dispatchEventUp();
  } else {
    var game = context.getImageData(300, 100, 1, 1).data[0] != 0;
    var oVer = context.getImageData(340, 47, 1, 1).data[0] != 0;
    if (game && oVer) {
      if (isGameOver) {
        return;
      }
      isGameOver = true;
      clearInterval(obstacleCheckInterval);
      var timeRun = new Date() - startTime;
      scoreTimes.push({ timeRun, cactusCount, birdCount });
      console.log("game over. downosaur runned for: " + timeRun / 1000 + " sec. let him run again.");
      setTimeout(runDownosaurRun, 4000);
    }
  }

}

function printScoreTimes() {
  scoreTimes.forEach(function (item, idx) {
    console.log(idx + ': ' + item.timeRun / 100 + ' sec. Jumped ' + item.cactusCount + ' cactus, ducked ' + tiem.birdCount + ' birds! ');
  })
}

function stopIt() {
  clearInterval(obstacleCheckInterval);
}

function runDownosaurRun() {
  dispatchEventUp();
  startTime = new Date();
  setTimeout(fancyStartMove, 1200);
  setTimeout(fancyStartMove, 1600);
  setTimeout(fancyStartMove, 2000);
  setTimeout(fancyStartMove, 2400);
  setTimeout(fancyStartMove, 2800);
  //give time for timeout to vanish
  setTimeout(function () {
    obstacleCheckInterval = setInterval(checkObstable, 20);
    isGameOver = false;
  }, 400);

}

function fancyStartMove() {
  document.dispatchEvent(KeyDown_Press);
  setTimeout(function () { document.dispatchEvent(KeyDown_Release) }, 100);
}

function dispatchEventUp() {
  //console.log('press up');
  document.dispatchEvent(KeyUp_Press);
  setTimeout(dispatchEventUpEnd, 300);
}
function dispatchEventUpEnd() {
  //console.log('release up');
  document.dispatchEvent(KeyUp_Release);
  isActing = false;
}

function dispatchEventDown() {
  //console.log('press down');
  document.dispatchEvent(KeyDown_Press);
  setTimeout(dispatchEventDownEnd, 200);
}
function dispatchEventDownEnd() {
  //console.log('release down');
  document.dispatchEvent(KeyDown_Release);
  isActing = false;
}

//http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
var createKeyboardEvent = function (k, keyboarEventName) {
  var oEvent = document.createEvent('KeyboardEvent');

  // Chromium Hack
  Object.defineProperty(oEvent, 'keyCode', {
    get: function () {
      return this.keyCodeVal;
    }
  });
  Object.defineProperty(oEvent, 'which', {
    get: function () {
      return this.keyCodeVal;
    }
  });

  if (oEvent.initKeyboardEvent) {
    oEvent.initKeyboardEvent(keyboarEventName, true, true, document.defaultView, false, false, false, false, k, k);
  } else {
    oEvent.initKeyEvent(keyboarEventName, true, true, document.defaultView, false, false, false, false, k, 0);
  }

  oEvent.keyCodeVal = k;

  if (oEvent.keyCode !== k) {
    alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
  }

  return oEvent;
}

var KeyDown_Press = createKeyboardEvent('40', 'keydown');
var KeyDown_Release = createKeyboardEvent('40', 'keyup');

var KeyUp_Press = createKeyboardEvent('38', 'keydown');
var KeyUp_Release = createKeyboardEvent('38', 'keyup');

setTimeout(checkSite, 1000);