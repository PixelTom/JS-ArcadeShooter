var game = new Phaser.Game(500, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var bullets; var enemies; var bonuses; var lives;
var gameOver = false;
var scoreText; var score;
var player;
var playerSpeed = 275;
var fireRate; var fireRateMax = 30;
var tTimer; var speedEvent; var spawnEvent;
var emitter; 
var cease = false;
var gameSpeed = 1;
//******************************************************************************************************
// 
//******************************************************************************************************
function preload() {
	game.load.image('bullet1', 'lib/arcadeShooter/laserRed01.png')
	game.load.image('bullet2', 'lib/arcadeShooter/laserBlue01.png')
	game.load.image('bonus', 'lib/arcadeShooter/laserBlue08.png')
	game.load.image('bone', 'lib/arcadeShooter/bone.png')
	game.load.image('bg', 'lib/arcadeShooter/starSky.jpg')
	game.load.image('life', 'lib/arcadeShooter/life.png')
	game.load.image('tick', 'lib/yesButton.png');
    game.load.spritesheet('player', 'lib/arcadeShooter/dude.png', 66, 82);
    game.load.spritesheet('bat', 'lib/arcadeShooter/bat.png', 88, 47);
}
//******************************************************************************************************
// 
//******************************************************************************************************
function create() {
	sky = game.add.tileSprite(0, 0, 500, 800, 'bg');
	sky.autoScroll(0,10);

	tTimer = game.time.create(false);
	speedEvent = tTimer.loop(2000, upSpeed, this);
	spawnEvent = tTimer.loop(2000, spawnBaddie, this);
	tTimer.add(5000, spawnBonus, this);
	tTimer.start();
	// Initiate Physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	bonuses = game.add.group();
	enemies = game.add.group();
	bullets = game.add.group();
	lives = game.add.group();

	bonuses.enableBody = true;
	enemies.enableBody = true;
	bullets.enableBody = true;

	buildPlayer();

	score = 0;
	scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#FFF' });
	descText = game.add.text(36, 750, 'TAP AND HOLD HERE TO MOVE', { fontSize: '32px', fill: '#FFF' });

	fireRate = 0;

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
	player.health = 4;
	game.physics.arcade.enable(player);
	player.animations.add('normal',[0,1],5,true);
	player.animations.add('dead',[2],5,true);
	hitAnimation = player.animations.add('hit',[2,3,2,3,2],10,false);
	hitAnimation = hitAnimation.onComplete.add(afterHit,this);
	player.animations.play('normal');

	for(var i = 0; i < player.health; i++){
		life = lives.create(380 + (i * 20), 15, 'life')
	}
}
//******************************************************************************************************
// 
//******************************************************************************************************
function update() {
	if(gameOver)return;
	player.body.velocity.x = 0;
	if((game.input.mousePointer.isDown || game.input.pointer1.isDown) && !cease){
		pointer = game.input.mousePointer;
		if(pointer.x < 0 && pointer.y < 0)pointer = game.input.pointer1;
		if(player.x + 10 < pointer.x)player.body.velocity.x = playerSpeed;//player.x += playerSpeed;
		if(player.x - 10 > pointer.x)player.body.velocity.x = playerSpeed * -1;//player.x -= playerSpeed;
		fireRate--;
		if(fireRate <= 0)fire();
	}else{
		fireRate = 0;
	}
	bullets.forEach(bulletOutBounds,this,true);
	bonuses.forEach(bonusOutBounds,this,true);
	game.physics.arcade.overlap(bullets,enemies,shotBaddie);
	game.physics.arcade.overlap(player,enemies,hitPlayer);
	game.physics.arcade.overlap(player,bonuses,doBonus);
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
	baddie.body.velocity.y = 100 * gameSpeed;
	baddie.health = 3;
}
function spawnBonus(){
	tTimer.add(10000, spawnBonus, this);
	bonus = bonuses.create(rn(50,400), -50, 'bonus');
	bonus.anchor.setTo(0.5, 0.5);
	bonus.body.velocity.y = 300;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function fire(){
	bullet = bullets.create(player.x,player.y,fireRateMax == 5 ? 'bullet2' : 'bullet1');
	bullet.anchor.setTo(0.5,0.5);
	//bullet.body.gravity = 0;
	bullet.body.velocity.y = -500;
	fireRate = fireRateMax;
}
function shotBaddie(bullet, baddie){
	bullet.kill();
	baddie.animations.play('hit');
	baddie.health--;
	if(baddie.health <= 0)killBaddie(baddie, true);
}
function killBaddie(baddie, didScore){
	baddie.destroy();
	if(didScore)addScore(10);
	emitter.x = baddie.x;
	emitter.y = baddie.y;
	emitter.start(true, 500, null, rn(3,5));
}
function hitPlayer(player, baddie){
	killBaddie(baddie, false);
	player.animations.play('hit');
	player.health--;
	life = lives.getFirstAlive();
	life.destroy();
	cease = true;
}
function afterHit(e){
	if(e == player){
		if(player.health > 0){
			cease = false;
			e.animations.play('normal');
		}else{
			endLevel();
		}
	}else{
		e.animations.play('normal');
	}
}
function upSpeed(){
	gameSpeed += 0.1;
	if(gameSpeed == 2){
		tTimer.remove(spawnEvent);
		spawnEvent = tTimer.loop(1500, spawnBaddie, this);
	}
	if(gameSpeed == 3){
		tTimer.remove(spawnEvent);
		spawnEvent = tTimer.loop(1000, spawnBaddie, this);
	}
	if(gameSpeed == 4){
		tTimer.remove(spawnEvent);
		spawnEvent = tTimer.loop(500, spawnBaddie, this);
	}
}
function doBonus(player, bonus){
	bonus.destroy();
	fireRateMax = 5;
	tTimer.add(4000, endBonus, this);
}
function endBonus(){
	fireRateMax = 30;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function bulletOutBounds(e){if(e.y - 20 < 0) e.kill();}
function bonusOutBounds(e){if(e.y + 20 > game.height) e.kill();}
//******************************************************************************************************
// 
//******************************************************************************************************
function addScore(n){
	score += n;
    scoreText.text = 'Score: ' + score;
}
//******************************************************************************************************
// 
//******************************************************************************************************
function endLevel(){
	player.animations.play('dead');
	tTimer.removeAll();
	enemies.forEach(killGroupObject,this,true);
	bullets.forEach(killGroupObject,this,true);
	bonuses.forEach(killGroupObject,this,true);
	gameOver = true;
	endText = game.add.text(game.world.centerX - 150, 300, 'You Deads. Play Again?', { fontSize: '32px', fill: '#FFF' });
	endButton = game.add.button(game.world.centerX - 80, 350, 'tick', resetGame, this, 2, 1, 0);
	endButton.scale.setTo(0.5,0.5);
}
//******************************************************************************************************
// 
//******************************************************************************************************
function resetGame(){
	window.location.reload(false); 
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