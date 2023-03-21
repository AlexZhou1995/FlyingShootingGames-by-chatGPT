var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var player = {
 x: canvas.width/2 -25, //玩家初始位置居中
 y: canvas.height -50,
 width:50,
 height:50,
 speed:5
};

var keyState = {};
window.addEventListener("keydown", function(e) {
 keyState[e.keyCode] = true;
});
window.addEventListener("keyup", function(e) {
 delete keyState[e.keyCode];
});

var enemies = [];
var enemyWidth =50;
var enemyHeight =50;
var enemySpeed =2;
var enemySpawnRate =60; //每秒产生一个敌人

function spawnEnemy() {
 var enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
 var enemyY =0;
 var enemy = {
 x: enemyX,
 y: enemyY,
 width: enemyWidth,
 height: enemyHeight,
 speed: enemySpeed
 };
 enemies.push(enemy);
}

var bullets = [];
var bulletWidth =5;
var bulletHeight =10;
var bulletSpeed =10;

function fireBullet() {
 var bulletX = player.x + player.width/2 - bulletWidth/2;
 var bulletY = player.y - bulletHeight;
 var bullet = {
 x: bulletX,
 y: bulletY,
 width: bulletWidth,
 height: bulletHeight,
 speed: bulletSpeed
 };
 bullets.push(bullet);
}

function update() {
 //更新玩家位置
 if(keyState[37]) { //向左箭头
 player.x -= player.speed;
 }
 if(keyState[39]) { //向右箭头
 player.x += player.speed;
 }

 //更新敌人位置
 for(var i=0; i<enemies.length; i++) {
 enemies[i].y += enemies[i].speed;
 if(enemies[i].y > canvas.height) {
 enemies.splice(i,1);
 i--;
 }
 }

 //更新子弹位置
 for(var i=0; i<bullets.length; i++) {
 bullets[i].y -= bullets[i].speed;
 if(bullets[i].y <0) {
 bullets.splice(i,1);
 i--;
 }
 }

 //检查子弹是否击中敌人
 for(var i=0; i<bullets.length; i++) {
 for(var j=0; j<enemies.length; j++) {
 if(collides(bullets[i], enemies[j])) {
 bullets.splice(i,1);
 i--;
 enemies.splice(j,1);
 j--;
 }
 }
 }

 //检查敌人是否碰到玩家
 for(var i=0; i<enemies.length; i++) {
 if(collides(enemies[i], player)) {
 gameOver();
 return;
 }
 }

 //产生敌人
 if(Math.floor(Math.random() * enemySpawnRate) ===0) {
 spawnEnemy();
 }
}

function render() {
 //清除画布
 context.clearRect(0,0, canvas.width, canvas.height);

 //绘制玩家
 context.fillStyle = "blue";
 context.fillRect(player.x, player.y, player.width, player.height);

 //绘制敌人
 context.fillStyle = "red";
 for(var i=0; i<enemies.length; i++) {
 context.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
 }

 //绘制子弹
 context.fillStyle = "black";
 for(var i=0; i<bullets.length; i++) {
 context.fillRect(bullets[i].x, bullets[i].y, bulletWidth, bulletHeight);
 }
}

function collides(a, b) {
 return a.x < b.x + b.width &&
 a.x + a.width > b.x &&
 a.y < b.y + b.height &&
 a.y + a.height > b.y;
}

function gameOver() {
 alert("游戏结束！");
 location.reload();
}

setInterval(function() {
 update();
 render();
},1000/60);

setInterval(fireBullet,500); //每秒钟可以发射两颗子弹
