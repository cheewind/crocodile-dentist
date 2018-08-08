import ImageManager from './ImageManager.js';

(() => {
  const CANVAS_WIDTH = 1024;
  const CANVAS_HEIGHT = 768;
  
  const TEETH_WIDTH = 71;
  const TEETH_HEIGHT = 81;
  const TOOTH_POSITION = [
    { x: 400, y: 430 },
    { x: 330, y: 470 },
    { x: 260, y: 520 },
    { x: 240, y: 610 },
    { x: 330, y: 625 },
    { x: 420, y: 625 },
    { x: 510, y: 610 },
    { x: 590, y: 600 },
    { x: 670, y: 580 },
    { x: 750, y: 550 },
    { x: 820, y: 510 }
  ];
  
  const CURRENT_PLAYER_HINT_WIDTH = 500;
  const CURRENT_PLAYER_HINT_HEIGHT = 50;
  const CURRENT_PLAYER_HINT_POSITION = { x: 262, y: 50 };
  
  // 0: empty 1: player1 2: player2
  let currentPlayer = 0;
  
  // -1: need initialize
  let decayTeeth = -1;
  
  let showDecay = false;
  
  // true: remove, false: exist
  let toothRemove = [];
  for (let i = 0; i < 11; ++i) toothRemove[i] = false;
  
  function createGame() {
    let game = document.createElement('div');
    game.id = 'game';
    
    let canvas = document.createElement('canvas');
    game.appendChild(canvas);
    canvas.id = 'canvas';
    canvas.setAttribute('height', CANVAS_HEIGHT);
    canvas.setAttribute('width', CANVAS_WIDTH);
    
    let ui = document.createElement('div');
    game.appendChild(ui);
    ui.id = 'ui';
    
    return game;
  }
  
  function createUI() {
    let ui = document.getElementById('ui');
    //
    let currentPlayerHint = document.createElement('div');
    ui.appendChild(currentPlayerHint);
    currentPlayerHint.id = 'currentPlayerHint';
    currentPlayerHint.classList.add('unselectable');
    currentPlayerHint.style.width = CURRENT_PLAYER_HINT_WIDTH + 'px';
    currentPlayerHint.style.height = CURRENT_PLAYER_HINT_HEIGHT + 'px';
    currentPlayerHint.style.position = 'absolute';
    currentPlayerHint.style.top = CURRENT_PLAYER_HINT_POSITION.y + 'px';
    currentPlayerHint.style.left = CURRENT_PLAYER_HINT_POSITION.x + 'px';
    currentPlayerHint.style.textAlign = 'center';
    currentPlayerHint.style.fontSize = '36px';
  }
  
  function drawSky(ctx) {
    ctx.fillStyle = 'hsl(180, 90%, 50%)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }  
  function createSky() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    drawSky(ctx);
  }
  
  async function drawCrocodile(ctx) {
    // shortcut
    let I = ImageManager.getImage.bind(ImageManager);
    let cdi = ctx.drawImage.bind(ctx);
    // draw crocodile
    cdi(await I('crocodile'), 0, 0);
    // draw tooth
    for (let i = 0; i < 11; ++i) {
      if (toothRemove[i]) continue;
      let position = TOOTH_POSITION[i];
      let teeth = await I('teeth');
      if (showDecay && decayTeeth == i) teeth = await I('decay_teeth');
      cdi(teeth, position.x, position.y);
    }
  }
  function createCrocodile() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    drawCrocodile(ctx);
    // make clickarea
    let tooth = document.createElement('div');
    document.getElementById('ui').appendChild(tooth);
    tooth.id = 'tooth';
    for (let i in TOOTH_POSITION) {
      let position = TOOTH_POSITION[i];
      let teeth = document.createElement('div');
      tooth.appendChild(teeth);
      teeth.id = 'teeth' + i;
      teeth.classList.add('clickarea');
      teeth.style.width = TEETH_WIDTH + 'px';
      teeth.style.height = TEETH_HEIGHT + 'px';
      teeth.style.position = 'absolute';
      teeth.style.top = position.y + 'px';
      teeth.style.left = position.x + 'px';
      teeth.addEventListener('click', toothOut.bind(this, i));
    }
  }
  
  function drawScene() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    drawSky(ctx);
    drawCrocodile(ctx);
  }
  
  function initialize() {
    // load image
    ImageManager.load('crocodile', './crocodile.png');
    ImageManager.load('teeth', './teeth.png');
    ImageManager.load('decay_teeth', './decay_teeth.png');    
    //
    createUI();
    createSky();
    createCrocodile();
  }
  
  function setCurrentPlayer(player) {
    currentPlayer = player;
    document.getElementById('currentPlayerHint').innerHTML = 'Player ' + player + "'s turn";
  }
  
  function toothOut(index) {
    // detect game end
    if (currentPlayer == -1) return;
    //
    if (index == decayTeeth) {
      document.getElementById('currentPlayerHint').innerHTML = 'Player ' + currentPlayer + ' Lose!';
      currentPlayer = -1;
      showDecay = true;
      drawScene();
      return;
    }
    //
    toothRemove[index] = true;
    document.getElementById('teeth' + index).remove();
    drawScene();
    // change player
    if (currentPlayer == 1) {
      setCurrentPlayer(2);
    }
    else {
      setCurrentPlayer(1);
    }
  }
  
  function start() {
    // decide decayTeeth
    decayTeeth = Math.floor(Math.random() * 11);    
    // start player
    setCurrentPlayer(1);
  }
  
  window.addEventListener('load', e => {
    let game = createGame();
    document.body.appendChild(game);
    
    initialize();
    start();
  });
})();
