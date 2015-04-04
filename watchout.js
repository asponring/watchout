// start slingin' some d3 here.

var Game = function(height, width, numEnemies) {
  this.height = height;
  this.width = width;
  var svg = d3.select(".battlefield").append("svg").attr("width", width).attr('height', height);

  this.players = [new Player(this.height,this.width)];

  var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragged);

  var player = d3.select("svg").data(this.players, function(d,i) {return i;})
            .append("circle")
            .attr("r", "5")
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




  function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  }



// var transform = function(player, opts) {
//     player@setX opts.x || @x
//     @setY opts.y || @y

//     @el.attr 'transform',
//       "rotate(#{@angle},#{@getX()},#{@getY()}) "+
//       "translate(#{@getX()},#{@getY()})"


  // var moveRelative = function (dx,dy) {
    // console.log('hi');
    // this.x  = this.x + dx;
    // this.y = this.y + dy;
    // angle: 360 * (Math.atan2(dy,dx)/(Math.PI*2))
  // };

// var dragHandler = function(event) {
//   moveRelative(d3.event.dx, d3.event.dy);
// }

// moveRelative();
// var drag = d3.behavior.drag()
//   .on('drag', dragHandler);

// setupDragging: =>
//     dragMove = =>
//       @moveRelative(d3.event.dx, d3.event.dy)



//     @el.call(drag)


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
  this.x = 40 + Math.random() * (this.width - 40);
  this.y = 40 + Math.random() * (this.height - 40);
};

var newGame = Game(340, 340, 50);


