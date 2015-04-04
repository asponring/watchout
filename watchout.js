// start slingin' some d3 here.

var Game = function(height, width, numEnemies) {
  this.height = height;
  this.width = width;
  var svg = d3.select(".battlefield").append("svg").attr("width", width).attr('height', height);
  this.player = d3.select("svg").append("circle").attr("r", "5").attr("fill", "#ff0000").attr("cx", "100").attr("cy", "100");
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
    .attr("r", "5");

  var nextMove = function() {
    for (var x = 0; x < numEnemies; x++) {
      this.enemies[x].randomizePos();
    }
    enemyDots.transition()
        .duration(2000)
        .attr("cx", function(d) {return d.x;})
      .attr("cy", function(d) {return d.y;});

      setTimeout(nextMove.bind(this), 3000);
  };

  nextMove();


};
var Enemy = function(height, width) {
  this.width = width;
  this.height = height;
  this.randomizePos();
};
Enemy.prototype.randomizePos = function() {
  this.x = 40 + Math.random() * (this.width - 40);
  this.y = 40 + Math.random() * (this.height - 40);
};

var newGame = Game(340, 340, 50);

