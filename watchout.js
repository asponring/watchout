// start slingin' some d3 here.

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

  enemyDots.enter().append("circle")
    .attr("cx", function(d) {return d.x;})
    .attr("cy", function(d) {return d.y;})
    .attr("fill", "black")
    .attr("class", "enemy")
    .attr("r", this.radius);



  function dragged(d) {
    var x = d3.event.x;
    var y = d3.event.y;
    d3.select(this).attr("cx", x);
    if (d3.select(this).attr("cx") > this.width - 300) {
      x = this.width - 300;
    }
    d3.select(this).attr("cy", y);
    if (d3.select(this).attr("cy") > this.height - 300) {
      y = this.height - 300;
    }
  }

  var tweenWithCollisionDetection = function(endData) {
    var endPos, enemy, startPos;
    enemy = d3.select(this);
    var player = d3.select(".player");
    startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
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
      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };

  var checkCollision = function(enemy, player) {
    var x = enemy.attr("cx");
    var y = enemy.attr("cy");
    var playerx = player.attr("cx");
    var playery = player.attr("cy");

    var distance = Math.sqrt(Math.pow((x - playerx), 2) + Math.pow((y - playery), 2));

    if (distance <= 2*this.radius && (new Date().getTime() - time > 500)) {
      time = new Date().getTime();
      this.collision++;
      d3.selectAll(".c").text(this.collision);
      this.score = 0;
      console.log(this.collision);
    }

  };

  var nextMove = function() {
    for (var x = 0; x < numEnemies; x++) {
      this.enemies[x].randomizePos();
    }
    enemyDots.transition()
        .duration(2000)
        .tween("custom", tweenWithCollisionDetection)
        .attr("cx", function(d) {return d.x;})
      .attr("cy", function(d) {return d.y;});

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
  this.x = 36 + Math.random() * (this.width - 10);
  this.y = 80 + Math.random() * (this.height - 10);
};


var newGame = Game(340, 340, 15);


