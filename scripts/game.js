document.addEventListener('DOMContentLoaded', function () {

  const Snake = function () {
    this.body = [[3, 5], [4, 5], [5, 5]];
  };

  const Food = function () {
    this.x = Math.floor(Math.random() * width / tileSize + 1);
    this.y = Math.floor(Math.random() * height / tileSize + 1);
  };

  const canvas = document.getElementById('canvas');
  const width = canvas.width;
  const height = canvas.height;
  const tileSize = 25;
  let context = canvas.getContext('2d');
  let gameOver = false;
  let points = 0;
  let snake = new Snake();
  let food = new Food();
  const Directions = Object.freeze({up: 1, down: -1, left: 2, right: -2});
  let currentDir = Directions.left;
  let lastDir = currentDir;


  //input processing
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === 87) {       // W
      currentDir = Directions.up;
    }
    else if (event.keyCode === 83) {  // S
      currentDir = Directions.down;
    }
    else if (event.keyCode === 65) {  // A
      currentDir = Directions.left;
    }
    else if (event.keyCode === 68) {   // D
      currentDir = Directions.right;
    }
  });

  let gameLoop = function () {

    //move snake and check game over
    for (var i = snake.body.length - 1; i > 0; i--) {
      if (snake.body[0][0] === snake.body[i][0] && snake.body[0][1] === snake.body[i][1]) {
        gameOver = true;
      }

      snake.body[i][0] = snake.body[i - 1][0];
      snake.body[i][1] = snake.body[i - 1][1];
    }

    // direction checking
    if (currentDir === lastDir * -1) {
      currentDir = lastDir;
    } else {
      lastDir = currentDir;
    }

    // move first snake part to direction
    switch (currentDir) {
      case Directions.up: {
        console.log('UP!');
        snake.body[0][1] = snake.body[0][1] - 1;
        break;
      }
      case Directions.down: {
        console.log('DOWN!');
        snake.body[0][1] = snake.body[0][1] + 1;
        break;
      }
      case Directions.left: {
        console.log('LEFT!');
        snake.body[0][0] = snake.body[0][0] - 1;
        break;
      }
      case Directions.right: {
        console.log('RIGHT!');
        snake.body[0][0] = snake.body[0][0] + 1;
        break;
      }
    }

    // food met --> spawn new food + add snake part
    if (snake.body[0][0] === food.x && snake.body[0][1] === food.y) {
      points++;
      food = new Food();
      snake.body.push([snake.body[snake.body.length - 1][0], snake.body[snake.body.length - 1][1]]);
    }

    // move snake to other side on side end
    if (snake.body[0][0] > width / tileSize - 1) {
      snake.body[0][0] = 0;
    } else if (snake.body[0][0] < 0) {
      snake.body[0][0] = width / tileSize - 1;
    }

    if (snake.body[0][1] > height / tileSize - 1) {
      snake.body[0][1] = 0;
    } else if (snake.body[0][1] < 0) {
      snake.body[0][1] = height / tileSize - 1;
    }

    //
    //  Rendering
    //

    // green background
    for (let y = 0; y < height / tileSize; y++) {
      for (let x = 0; x < width / tileSize; x++) {
        if (x % 2 !== y % 2) {
          context.fillStyle = 'rgb(50, 250, 110)';
        } else {
          context.fillStyle = 'rgb(50, 220, 110)';
        }
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    //Food
    context.fillStyle = 'rgb(100,120,250)';
    context.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    //Snake
    snake.body.forEach(function (part) {
      context.fillStyle = 'rgb(200,100,100)';
      context.fillRect(part[0] * tileSize, part[1] * tileSize, tileSize, tileSize);
    });

    // Points
    context.fillStyle = 'rgb(255,255,255)';
    context.font = '30px Sans';
    context.fillText('' + points, 10, 50);


    //check for game over --> stop game loop
    if (gameOver === true) {
      clearInterval(interval);
      context.font = '75px Sans';
      context.fillText('Du hast verloren!', width / 2 - 320, height / 2);
      context.fillText(points + ' Punkte', width / 2 - 175, height / 2 + 75);
      // start new game
      setTimeout(function () {
        window.location.reload();
      }, 5000);
    }
  };

  // game loop 2fps
  let interval = setInterval(gameLoop, 500);
});
