var Game = function(height, width, numEnemies) {
  this.height = height;
  this.width = width;
  this.score = 0;
  this.highScore = 0;
  this.collision = 0;
  this.radius = 10;
  var time = new Date().getTime();

  var svg = d3.select(".battlefield").append("svg").attr("width", width).attr('height', height);

  this.players = [new Player(this.height,this.width)];

  var dragged = function(d) {
    d3.select(this).attr("cx", d.x = (d3.event.x > 330) ? 330 : (d3.event.x < 10)  ? 10: d3.event.x)
                  .attr("cy", d.y = (d3.event.y > 330) ? 330 : (d3.event.y < 10)  ? 10: d3.event.y);
  };
  var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragged);

  var player = d3.select("svg")
            .data(this.players, function(d,i) {return i;});


  var countScore = function() {
    this.score++;
    d3.select("body").selectAll(".score")
    .data([this.score], function(d, i) {return i;})
    .attr("data-score", function(d) {return d;});

    d3.selectAll(".score").text(this.score);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      d3.selectAll(".highScore").text(this.score);
    }
  };


  setInterval(countScore, 100);

  player
    .append("circle")
    .attr("class", "player")
    .attr("r", this.radius)
    .attr("fill", "#ff0000")
    .attr("cx", function(d,i) {return d.x;})
    .attr("cy", function(d,i) {return d.x;})
    .call(drag);

  this.enemies = [];
  for (var x = 0; x < numEnemies; x++) {
    this.enemies.push(new Enemy(this.height, this.width));
  }

  var enemyDots = d3.select("svg").selectAll(".enemy")
                  .data(this.enemies, function(d, i) {return i;});

  enemyDots.enter().append("image")
    .attr("x", function(d) {return d.x;})
    .attr("y", function(d) {return d.y;})
    .attr("height", "20px")
    .attr("width", "20px")
    .attr("xlink:href", "shuriken.png")
    .attr("fill", "black")
    .attr("class", "enemy rotate");

  var tweenWithCollisionDetection = function(endData) {
    var endPos, enemy, startPos, endX, endY;
    enemy = d3.select(this);
    var player = d3.select(".player");
    startPos = {
      x: parseFloat(enemy.attr('x')),
      y: parseFloat(enemy.attr('y'))
    };

    endPos = {
      x: endData.x,
      y: endData.y
    };
    return function(t) {
      var enemyNextPos;
      checkCollision(enemy, player);
      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      return enemy.attr('x', enemyNextPos.x).attr('y', enemyNextPos.y);
    };
  };

  var checkCollision = function(enemy, player) {
    var x = enemy.attr("x");
    var y = enemy.attr("y");
    var playerx = player.attr("cx");
    var playery = player.attr("cy");

    var distance = Math.sqrt(Math.pow((x - playerx), 2) + Math.pow((y - playery), 2));

    if (distance <= 2*this.radius && (new Date().getTime() - time > 500)) {
      time = new Date().getTime();
      this.collision++;
      d3.selectAll(".c").text(this.collision);
      this.score = 0;
    }
  };

  var nextMove = function() {
    for (var x = 0; x < numEnemies; x++) {
      this.enemies[x].randomizePos();
    }
    enemyDots.transition()
        .duration(2000)
        .tween("custom", tweenWithCollisionDetection)
        .attr("x", function(d) {return d.x;})
      .attr("y", function(d) {return d.y;});

      setTimeout(nextMove.bind(this), 3000);
  };

  nextMove();
};

var Player = function(height, width) {
  this.x = width/2;
  this.y = height/2;
};

var Enemy = function(height, width) {
  this.width = width;
  this.height = height;
  this.randomizePos();
};
Enemy.prototype.randomizePos = function() {

  this.x = Math.random() * (this.width);
  this.y = Math.random() * (this.height);

    if (this.x > 320) {
      this.x = 320;
    }
    if (this.x < 20) {
      this.x = 20;
    }
    if (this.y > 320) {
      this.y = 320;
    }
    if (this.y < 20) {
      this.y = 20;
    }
};

var newGame = Game(340, 340, 15);


