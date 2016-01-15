window.onload = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  Game.start();
};
Game = {}; //Holds all global game varibles/stats/methods
Game.ticks = 60; //physics updats per sec
Game.skip_ticks = 1000 / Game.ticks; //millseconds between
Game.next_tick = Date.now(); //time of next pyshics step
Game.interpolation = 0; //valle for interpolating render location between physics steps
Game.running = true; //State of game(running, stopped, or menu;
Game.cur_state = "main"; //current menu
Game.score = 0;
Game.state = {}
Game.state.logic = function() {};
Game.state.render = function() {};
Game.run = function() //game loop, calls logic function and render function, evalutes inperpolation
  {
    if (Game.running) {
      while (Date.now() > Game.next_tick) {
        Game.next_tick = Game.next_tick + Game.skip_ticks;
        Game.logic();
        timeManager.tick()
        CheckInput()
      };
      Game.render();
      Game.interpolation = (Date.now() + Game.skip_ticks - Game.next_tick) / Game.skip_ticks;
      window.requestAnimationFrame(Game.run);
    } else {
      Update_menu();
      window.requestAnimationFrame(Game.run);
    }
  };
Game.logic = function() {
  Game.state.logic();
};
Game.render = function() {
  Game.state.render();
};
Game.change_state = function(state) {
  Game.cur_state = state.id;
  Game.state.logic = state.logic;
  Game.state.render = state.render;
  state.start();
}
Game.start = function() {
  Game.next_tick = Date.now();
  Game.interpolation = 1;
  Game.change_state(Load_Screen);
  canvas.width = Grid.width * Grid.size + 4
  canvas.height = Grid.height * Grid.size + 2
  window.requestAnimationFrame(Game.run);
}
interp = function(x, x2) {
  return (x + ((x2 - x) * Game.interpolation))
}

function RAD(r) {
  return r * (Math.PI / 180)
}
randrange = function(min, max) {
  return Math.floor((Math.random() * (max - min) + min))
}