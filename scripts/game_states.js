Game_State = {}
Game_State.id = "Game"
  
Game_State.start = function() {
    Grid.createTetrisGrid(Grid.width, Grid.height, 0)
    Randomizer.pieces = []
    Randomizer.generate()
    cur_Tetro = Randomizer.getPiece()
    ghostTetro = new tetromino(cur_Tetro.shape_index, 0)
    score = 0
    lines = 0
    level = 0
  }

Game_State.logic = function() {
    cDown = false
    cLeft = false
    cRight = false
    CheckTetroCollision()
    CheckRows()
    ghostTetro.y = cur_Tetro.y
    ghostTetro.x = cur_Tetro.x
    ghostTetro.ori = cur_Tetro.ori
    placeGhostTetro()
    if ((cDown) && (LOCK_DELAY_ON == false)) {
      LOCK_DELAY_ON = true;
      LOCK_timer.reset(true)
    }
    if (cDown == false) {
      LOCK_DELAY_ON = false;
      LOCK_timer.reset(false)
    }
    if (LOCK_timer.end) {
      CommitTetro();
      LOCK_DELAY_ON = false;
      LOCK_timer.reset(false)
    }
    if ((GRAV_timer.end) && (LOCK_DELAY_ON == false)) {
      cur_Tetro.y += 1
    }
    if (Key.state[32] == "pressed") {
      {
        LOCK_DELAY_ON = true;
        LOCK_timer.reset(true);
        cur_Tetro.y = ghostTetro.y
      }
    }
    if (Key.state[38] == "pressed") {
      RotateTetro(1);
      DAS_timer.reset(true)
    }
    if ((Key.state[38] == "down") && (DAS_timer.end)) {
      if (ASS_timer.run == false) {
        ASS_timer.reset(true)
      }
      if (ASS_timer.time == 0) {
        RotateTetro(1)
      }
    }
    if (Key.state[39] == "pressed") {
      tetro_dir = "R";
      DAS_timer.reset(true);
      if (cRight == false) {
        cur_Tetro.x += 1
      }
    }
    if (Key.state[37] == "pressed") {
      tetro_dir = "L";
      DAS_timer.reset(true);
      if (cLeft == false) {
        cur_Tetro.x -= 1
      }
    }
    if (((Key.state[39] == "down") || (Key.state[37] == "down")) && (DAS_timer.end)) {
      if (ASS_timer.run == false) {
        ASS_timer.reset(true)
      }
      if (ASS_timer.time == 0) {
        if ((tetro_dir == "R") && (cRight == false)) {
          cur_Tetro.x += 1
        } else if ((tetro_dir == "L") && (cLeft == false)) {
          cur_Tetro.x -= 1
        } else {
          ASS_timer.reset(true)
        }
      }
    }
    if ((Key.state[40] == "pressed") && (cDown == false)) {
      DROP_timer.reset(true);
      GRAV_timer.reset(true);
      cur_Tetro.y += 1
    }
    if ((Key.state[40] == "down") && (DROP_timer.time == 0) && (cDown == false)) {
      GRAV_timer.reset(true);
      cur_Tetro.y += 1
    }
    if ((Key.state[40] == "down") && (LOCK_DELAY_ON)) {
      CommitTetro();
      LOCK_DELAY_ON = false;
      LOCK_timer.reset(false)
    }
  
    //keeps spawned piece in place until line is clear
    if (LINECLEAR_timer.run) {
      if (cur_Tetro.shape_index == 0) {
        cur_Tetro.y = 1
      } else {
        cur_Tetro.y = 2
      };
    }
    if (LINECLEAR_timer.end) {
      CollapseRows();
      LINECLEAR_timer.reset(false);
    }
    if ((full_rows.length > 0) && (LINECLEAR_timer.run == false)) {
      LINECLEAR_timer.reset(true)
    }
  }

Game_State.render = function() {
  ctx.globalCompositeOperation = "source-over"
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(ctx, 0, 0, canvas.width, canvas.height, 3, 0, null, "rgb(30,30,30)") //draws background
  drawRect(ctx, 0, Grid.size * 5, Grid.size * Grid.width, 2, 0, "rgb(50,50,50)", "rgb(50,50,50)") //draws fill line
  Grid.draw(ctx)
  DrawTetromino(ghostTetro, ghostTetro.x * Grid.size + 2, ghostTetro.y * Grid.size, Grid.size, "rgba(200,200,200,.5)")
  DrawTetromino(cur_Tetro, cur_Tetro.x * Grid.size + 2, cur_Tetro.y * Grid.size, Grid.size, COLORS[cur_Tetro.color])
  drawText(ctx, String(score), 230, 25, "20px LazyPossum", "rgba(190,190,190,.7)", "end")
  drawText(ctx, "Level " + String(level), 15, 45, "15px LazyPossum", "rgba(190,190,190,.7)", "start")
  drawText(ctx, "Level " + String(lines), 15, 60, "15px LazyPossum", "rgba(190,190,190,.7)", "start")
    //Draws Line Clear Animation
  for (var i = 0; i < full_rows.length; i++) {
    var lineClearColor = "rgba(250,250,250," + String(Math.pow(1 - (LINECLEAR_timer.time / LINECLEAR_timer.length), 3)) + ")"
    drawRect(ctx, 2, full_rows[i] * Grid.size, Grid.width * Grid.size, Grid.size, 3, 2, "rgb(25,25,25)", "rgb(25,25,25")
    drawRect(ctx, 2, full_rows[i] * Grid.size, Grid.width * Grid.size, Grid.size, 3, 2, "rgb(25,25,25)", lineClearColor)
  }
  //Draw Next 3 Tetrominos, note seperate case for drawing I piece so they all line up nicer
  if (Randomizer.pieces[0].shape_index != 0) {
    DrawTetromino(Randomizer.pieces[0], 80, 10, 6, COLORS[Randomizer.pieces[0].color])
  } else {
    DrawTetromino(Randomizer.pieces[0], 70, 0, 6, COLORS[Randomizer.pieces[0].color])
  }
  if (Randomizer.pieces[1].shape_index != 0) {
    DrawTetromino(Randomizer.pieces[1], 50, 10, 6, COLORS[Randomizer.pieces[1].color])
  } else {
    DrawTetromino(Randomizer.pieces[1], 40, 0, 6, COLORS[Randomizer.pieces[1].color])
  }
  if (Randomizer.pieces[2].shape_index != 0) {
    DrawTetromino(Randomizer.pieces[2], 20, 10, 6, COLORS[Randomizer.pieces[2].color])
  } else {
    DrawTetromino(Randomizer.pieces[2], 10, 0, 6, COLORS[Randomizer.pieces[2].color])
  }
}
End_State = {}
End_State.id = "end"
  
End_State.start = function() {}

End_State.logic = function() {
    if (Key.state[13] == "pressed") {
      Game.change_state(Title_Screen)
    }
  }

End_State.render = function() {
    ctx.globalCompositeOperation = "source-over"
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(ctx, 0, 0, canvas.width, canvas.height, 3, 0, null, "rgb(30,30,30)") //draws background
    drawRect(ctx, 0, Grid.size * 5, Grid.size * Grid.width, 2, 0, "rgb(50,50,50)", "rgb(50,50,50)") //draws fill line
    Grid.draw(ctx)
    drawRect(ctx, 0, 0, canvas.width, canvas.height, 6, 0, null, "rgba(30,30,30,.9)");
    ctx.drawImage(imgs.gameOver, 50, 200)
    ctx.drawImage(imgs.pressEnter, 53, 265)
    drawText(ctx, String(score) + " Points", 120, 190, "25px LazyPossum", "rgba(190,190,190,.7)", "center")
  }
 
Title_Screen = {}
Title_Screen.id = "Title_Screen"
Title_Screen.start = function() {}

Title_Screen.logic = function() {
    if (Key.state[13] == "pressed") {
      Game.change_state(Game_State)
    }
  }
  
Title_Screen.render = function() {
  ctx.globalCompositeOperation = "source-over"
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(ctx, 0, 0, canvas.width, canvas.height, 3, 0, null, "rgb(30,30,30)"); //draws background
  ctx.drawImage(imgs.title, 45, 150)
}
Load_Screen = {}
Load_Screen.id = "Load_Screen"
Load_Screen.start = function() {}
Load_Screen.logic = function() {
  if (imgLoadedCounter == imgSrc.length) {
    Game.change_state(Title_Screen), console.log("images loaded")
  }
}
Load_Screen.render = function() {
  ctx.globalCompositeOperation = "source-over"
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(ctx, 0, 0, canvas.width, canvas.height, 3, 0, null, "rgb(30,30,30)"); //draws background
}