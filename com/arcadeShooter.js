var game = new Phaser.Game(500, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var bullets; var enemies;
var gameOver = false;
var scoreText;
var player;
var playerSpeed = 5;
var fireRate; var fireRateMax = 30;
var tTimer; var cEvent;
var emitter;
//******************************************************************************************************
// 
//******************************************************************************************************
function preload() {
	game.load.image('bullet1', 'lib/laserRed01.png')
	game.load.image('bone', 'lib/bone.png')
    game.load.spritesheet('player', 'lib/dude.png', 66, 82);
    game.load.spritesheet('bat', 'lib/bat.png', 88, 47);
	//game.load.spritesheet('name', 'lib/name.png', width, height);
}
//******************************************************************************************************
// 
//******************************************************************************************************
function create() {
	// Initiate Physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	enemies = game.add.group();
	bullets = game.add.group();

	enemies.enableBody = true;
	bullets.enableBody = true;

	buildPlayer();

	scoreText = game.add.text(16, 16, 'Distance: 0', { fontSize: '32px', fill: '#000' });

	fireRate = 0;

	tTimer = game.time.create(false);
	cEvent = tTimer.loop(2000, spawnBaddie, this);
	tTimer.start();

	emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('bone');
    emitter.gravity = 0;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function buildPlayer(){
	// Legacy code, to be updated
	player = game.add.sprite(100, 650, 'player');
	player.anchor.setTo(0.5,0.5)
	//game.physics.arcade.enable(player);
	player.animations.add('run',[0,1],5,true);
	player.animations.play('run');
}
//******************************************************************************************************
// 
//******************************************************************************************************
function update() {
	if(gameOver)return;
	if(game.input.mousePointer.isDown){
		if(player.x + 5 < game.input.mousePointer.x)player.x += playerSpeed;
		if(player.x - 5 > game.input.mousePointer.x)player.x -= playerSpeed;
		fireRate--;
		if(fireRate <= 0)fire();
	}else{
		fireRate = 0;
	}
	bullets.forEach(checkBulletStatus,this,true);
	game.physics.arcade.overlap(bullets,enemies,shotBaddie);
}
//******************************************************************************************************
// 
//******************************************************************************************************
function spawnBaddie(){
	// currently bat only
	baddie = enemies.create(rn(50,400),-50,'bat');
	baddie.anchor.setTo(0.5,0.5);
	baddie.animations.add('normal',[0,1],5,true);
	hitAnimation = baddie.animations.add('hit',[2,0,2],10,false);
	hitAnimation.onComplete.add(afterHit,this);
	baddie.animations.play('normal');
	baddie.body.velocity.y = 100;
	baddie.health = 3;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function fire(){
	bullet = bullets.create(player.x,player.y,'bullet1');
	bullet.anchor.setTo(0.5,0.5);
	//bullet.body.gravity = 0;
	bullet.body.velocity.y = -500;
	fireRate = fireRateMax
}
function shotBaddie(bullet, baddie){
	bullet.kill();
	baddie.animations.play('hit');
	baddie.health--;
	if(baddie.health <= 0){
		baddie.destroy();
		emitter.x = baddie.x;
		emitter.y = baddie.y;
		emitter.start(true, 500, null, rn(3,5));
	}
}
function afterHit(e){
	e.animations.play('normal');
}
//******************************************************************************************************
// 
//******************************************************************************************************
function checkBulletStatus(e){
	if(e.y - 20 < 0) e.kill();
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
function fleeceItOut(){
	trace("fleece");
}