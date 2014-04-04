var game = new Phaser.Game(500, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var bullets; var enemies;
var gameOver = false;
var scoreText;
var player;
//******************************************************************************************************
// 
//******************************************************************************************************
function preload() {
    game.load.spritesheet('player', 'lib/dude.png', 66, 82);
	//game.load.spritesheet('name', 'lib/name.png', width, height);
}
//******************************************************************************************************
// 
//******************************************************************************************************
function create() {
	// Initiate Physics
	//game.physics.startSystem(Phaser.Physics.ARCADE);

	bullets = game.add.group();
	enemies = game.add.group();

	bullets.enableBody = true;
	enemies.enableBody = true;

	buildPlayer();

	scoreText = game.add.text(16, 16, 'Distance: 0', { fontSize: '32px', fill: '#000' });

	/*emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('star');
    emitter.gravity = 0;*/
}
//******************************************************************************************************
// 
//******************************************************************************************************
function buildPlayer(){
	// Legacy code, to be updated
	player = game.add.sprite(100, 600, 'player');
	game.physics.arcade.enable(player);
	player.animations.add('run',[0,1],5,true);
	player.animations.play('run');
}
//******************************************************************************************************
// 
//******************************************************************************************************
function update() {
	if(gameOver)return;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function checkBulletStatus(e){
	//if(bullets off screen) e.kill();
}
//******************************************************************************************************
// 
//******************************************************************************************************
function collectStar(player, star){
	star.kill();
	score += 10;
    scoreText.text = 'Score: ' + score;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function endLevel(){
	gameOver = true;
	endText = game.add.text(game.world.centerX - 100, 150, 'Splat. Play Again?', { fontSize: '32px', fill: '#000' });
	endButton = game.add.button(game.world.centerX - 50, 200, 'tick', resetGame, this, 2, 1, 0);
	endButton.scale.setTo(0.5,0.5);
}
//******************************************************************************************************
// 
//******************************************************************************************************
function resetGame(){
	endButton.destroy();
	endText.destroy();
	gameOver = false;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function killGroupObject(e){
	e.kill();
}
//******************************************************************************************************
// 
//******************************************************************************************************
function trace(e){
    console.log(e);
}
function rn(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}
//******************************************************************************************************