document.addEventListener("keydown", function(event) {
  Key.OnkeyDown(event);
}, false);
document.addEventListener("keyup", function(event) {
  Key.OnkeyUp(event);
}, false);
document.addEventListener("mousemove", function(event) {
  Mouse.Move(event);
}, false);
document.addEventListener("mouseup", function(event) {
  Mouse.OnMouseUp(event);
}, false);
document.addEventListener("mousedown", function(event) {
  Mouse.OnMouseDown(event);
}, false);
document.addEventListener("click", function(event) {
  Mouse.OnClick(event);
}, false);

Key = {};
Key.state = [];
Key.Left = 37;
Key.Up = 38;
Key.Right = 39;
Key.Down = 40;
Key.p = 80;
Key.r = 82;
Key.space = 32;

Key.preventDefaultKeys = [32,38,40];
Key.OnkeyDown = function(event) {
  if (Key.preventDefaultKeys.indexOf(event.keyCode) != -1) {
    event.preventDefault()
  }
  if (Key.state[event.keyCode] != "down") {
    Key.state[event.keyCode] = "pressed"
  }
}
Key.OnkeyUp = function(event) {
    Key.state[event.keyCode] = "released"
  }
 
Mouse = {};
Mouse.X = 0; //Cursor X position
Mouse.Y = 0; //Cursor Y position
Mouse.Down_X = 0; //Last Cick X position
Mouse.Down_Y = 0; //Last Cick Y position
Mouse.Up_X = 0
Mouse.Up_Y = 0
Mouse.Click_X = 0
Mouse.Click_Y = 0
Mouse.bounded = false; //whether cursor is inside canvas
Mouse.click_bounded = false; //whether last click was inside canvas
Mouse.state = ["up", "up", "up"]
Mouse.buttons = 0
Mouse.Move = function(event) {
  var canvas_bounds = canvas.getBoundingClientRect();
  Mouse.X = event.clientX - canvas_bounds.left;
  Mouse.Y = event.clientY - canvas_bounds.top;
}
Mouse.OnMouseUp = function(event) {
  var canvas_bounds = canvas.getBoundingClientRect();
  Mouse.Up_X = event.clientX - canvas_bounds.left;
  Mouse.Up_Y = event.clientY - canvas_bounds.top;
  diff = Mouse.buttons - event.buttons
  switch (diff) {
    case 1:
      Mouse.state[0] = "released"
      break;
    case 2:
      Mouse.state[1] = "released"
      break;
    case 3:
      Mouse.state[0] = "released"
      Mouse.state[1] = "released"
      break;
    case 4:
      Mouse.state[2] = "released"
      break;
    case 5:
      Mouse.state[0] = "released"
      Mouse.state[2] = "released"
      break;
    case 6:
      Mouse.state[1] = "released"
      Mouse.state[2] = "released"
      break;
    case 7:
      Mouse.state[0] = "released"
      Mouse.state[1] = "released"
      Mouse.state[2] = "released"
  }
  Mouse.buttons = event.buttons
}
Mouse.OnMouseDown = function(event) {
  var canvas_bounds = canvas.getBoundingClientRect();
  Mouse.Down_X = event.clientX - canvas_bounds.left;
  Mouse.Down_Y = event.clientY - canvas_bounds.top;
  diff = event.buttons - Mouse.buttons
  switch (diff) {
    case 1:
      Mouse.state[0] = "pressed"
      break;
    case 2:
      Mouse.state[1] = "pressed"
      break;
    case 3:
      Mouse.state[0] = "pressed"
      Mouse.state[1] = "pressed"
      break;
    case 4:
      Mouse.state[2] = "pressed"
      break;
    case 5:
      Mouse.state[0] = "pressed"
      Mouse.state[2] = "pressed"
      break;
    case 6:
      Mouse.state[1] = "pressed"
      Mouse.state[2] = "pressed"
      break;
    case 7:
      Mouse.state[0] = "pressed"
      Mouse.state[1] = "pressed"
      Mouse.state[2] = "pressed"
  }
  Mouse.buttons = event.buttons
}
Mouse.OnClick = function(event) {
    var canvas_bounds = canvas.getBoundingClientRect();
    Mouse.Click_X = event.clientX - canvas_bounds.left;
    Mouse.Click_Y = event.clientY - canvas_bounds.top;
    console.log("click")
  }
 
CheckInput = function() {
  for (i = 0; i < Key.state.length; i++) {
    if (Key.state[i] == "pressed") {
      Key.state[i] = "down"
    } else if (Key.state[i] == "released") {
      Key.state[i] = "up"
    }
  }
  for (i = 0; i <= 3; i++) {
    if (Mouse.state[i] == "released") {
      Mouse.state[i] = "up"
    } else if (Mouse.state[i] == "pressed") {
      Mouse.state[i] = "down"
    }
  }
}