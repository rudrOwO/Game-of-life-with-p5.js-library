//Declaring the global variables.
let rows;
let col;
let res = 20;
let grid;
let firebase;
let play = false;  // Flag to check whether the player is in editing mode or play mode. Default editing mode.
// let data;

// function preload()
// {
//   data = loadJSON("data.json");
// }


//Function to count neighbour with wrap around
function countNeighbour(grid, x, y) {

  let sum = 0;

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let r = (x + i + rows) % rows;
      let c = (y + j + col) % col;

      sum += grid.grid[r][c];

    }
  }

  //subtracting the value of self
  sum -= grid.grid[x][y];

  return sum;
}


function setup() {
  
  let canvas = createCanvas(500, 500);
  canvas.parent(select("main"));
  background(0,0,0,100);

  //Reducing the frame rate
  frameRate(15);
  
  rows = width / res;
  col = height / res;

  grid = new MakeGrid(width,height,res,80,80,80);
  grid.showGrid();

  button();

  //Block Context menu
  let cnv = document.querySelector("#defaultCanvas0");
  cnv.addEventListener('contextmenu',(evt) =>{
    evt.preventDefault();
  });


  //Loding data

  loadJSON("data.json",gotData);

  // let a = document.querySelector("#article");


  // for(let i = 0; i < data.list.length; i++)
  // {

  //   let id = "#bt"+(i+1);
  //   let btn = document.querySelector(id);

  //   btn.innerText = data.list[i].name;

  //   btn.addEventListener("click",()=>{
  //     grid.grid = data.list[i].grid;
  //     a.innerHTML = data.list[i].description;
  //     grid.showGrid();
  //   })

  // }

  // let diamond = select("#bt1");
  // let a = select("#article");
  // diamond.html("4-8-12 diamond");
  // diamond.mousePressed(() =>{
  //   grid.grid = data.diamond.grid;
  //   a.html(data.diamond.description);

  //   grid.showGrid();

  // })

}

function gotData(data)
{
  let a = document.querySelector("#article");

  for(let i = 0; i < data.list.length; i++)
  {
    let btn = document.querySelector("#bt"+(i+1));

    btn.innerText = data.list[i].name;

    btn.addEventListener("click",()=>{
      grid.grid = data.list[i].grid;
      a.innerHTML = data.list[i].description;
      grid.showGrid();
    })

  }
  console.log(data.list[0].description);
}


function draw() {


  //While play is false, that is when the player is editing the canvas
  if (!play) {
    if(mouseIsPressed)
    {
      grid.drawing(mouseX,mouseY,mouseButton);
    }
  }


  //While play is true, that is the game is running
  else {

    for (let i = 0; i < rows; i++) {

      for (let j = 0; j < col; j++) {
        //Moving through the coordinate based on squareResolution
        let x = i * res;
        let y = j * res;

        if (grid.grid[i][j] == 1) {
          fill('white');
        }
        else fill(80, 80, 80);

        rect(x, y, res - 1, res - 1);

      }
    }
    //Array for the next generation
    let next = new MakeGrid(width,height,20,80,80,80);


    //computing the value of next generation here
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < col; j++) {

        let neighbour = countNeighbour(grid, i, j);

        let state = grid.grid[i][j];

        if (state == 0 && neighbour == 3) {
          next.grid[i][j] = 1;
        }
        else if (state == 1 && (neighbour < 2 || neighbour > 3)) {
          next.grid[i][j] = 0;
        }
        else next.grid[i][j] = state;
      }
    }
    grid = next;
  }

}


function button()
{
  let sp = select(".button");

  // Play button
  let playButton = createButton("Play");
  playButton.parent(sp);
  playButton.attribute('class','button-6');
  playButton.mousePressed(function() {
      play = true;
      loop();
    });

  // Stop button
  let stopButton = createButton("Stop");
  stopButton.parent(sp);
  stopButton.attribute('class','button-6');
  stopButton.mousePressed(function() {

    noLoop();

  });

  //Random button
  let randomButton = createButton("Random");
  randomButton.parent(sp);
  randomButton.attribute('class','button-6');
  randomButton.mousePressed(function() {

    if (!play) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < col; j++) {
          grid.grid[i][j] = floor(random(2));
          let x = i * res;
          let y = j * res;
          rect(x, y, res - 1, res - 1);
        }
      }
      grid.showGrid();
    }

  })


  //Reset button
  let resetButton = createButton("Reset");
  resetButton.parent(sp);
  resetButton.attribute('class','button-6');
  resetButton.mousePressed(function() {
    play = false;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < col; j++) {
        grid.grid[i][j] = 0;
      }
    }
    grid.showGrid();
    loop();
  })


}
