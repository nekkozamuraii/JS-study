"use strict";

// 星クラス
class Star {
  constructor() {
    this.x = Math.random() * 600; // x座標
    this.y = Math.random() * 600; // y座標
    this.r = Math.random() * 5 + 1; // 半径
  }
  tick() {
    this.y += this.r; // 下に移動
    if (this.y > 600) {
      // 画面下部にきたら上へ移動
      this.y -= 600;
    }
    drawCircle(this.x, this.y, this.r, "#888800");
  }
}

// 自機クラス
class Ship {
  constructor() {
    this.img = document.getElementById("ship");
    this.x = 300;
    this.y = 500;
    this.sx = 0;
    this.sy = 0;
  }
  move(mouseX, mouseY) {
    this.sx = (mouseX - this.x) / 10; // マウスx方向へ移動
    this.sy = (mouseY - this.y) / 10; // マウスy方向へ移動
  }
  tick() {
    this.x += this.sx; // 速度sxを座標xに反映
    this.y += this.sy; // 速度syを座標yに反映
    ctx.drawImage(this.img, this.x - 50, this.y - 50);
  }
  shoot() {
    bullets.push(new Bullet(this.x, this.y, 0, -25, true)); // 発射
  }
}

// 敵クラス
class Enemy {
  constructor() {
    this.img = document.getElementById("enemy");
    this.x = Math.random() * 400 + 100; // x座標
    this.y = 0; // y座標
    this.sx = Math.random() * 5 - 2.5; // x方向初速
    this.sy = Math.random() * 15 + 15; // y方向初速
    this.shoot = false;
  }
  tick() {
    this.sy -= 1; // 速度を減らす
    this.x += this.sx; // 速度sxを座標xに反映
    this.y += this.sy; // 速度syを座標yに反映
    ctx.drawImage(this.img, this.x - 50, this.y - 50);

    if (this.shoot == false && this.sy < 0) {
      // 速度が上向きになったタイミングで弾丸発射
      let theta = Math.atan2(ship.y - this.y, ship.x - this.x);
      let sx = Math.cos(theta) * 10;
      let sy = Math.sin(theta) * 10;
      bullets.push(new Bullet(this.x, this.y, sx, sy, false));
      this.shoot = true;
    }
  }
}

// 弾丸クラス
class Bullet {
  constructor(x, y, sx, sy, isShip) {
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.isShip = isShip; // 自機か否か
  }
  tick() {
    this.x += this.sx;
    this.y += this.sy;
    drawCircle(this.x, this.y, 5, this.isShip ? "blue" : "red");
  }
}

// (x,y)を中心に半径r、色colorの円を描画
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

let ctx; // 描画コンテキスト
let ship; // 自機
let back; // 背景画像
let count = 0; // 敵出現用カウンタ
let interval = 50; // 出現頻度
let timerId; // タイマー
let bullets = []; // 弾丸のリスト
let enemies = []; // 敵のリスト
const stars = []; // 星のリスト
let score = 0; // スコア

onload = function () {
  ctx = document.getElementById("field").getContext("2d");
  ctx.font = "32px 'Times New Romen'";
  ship = new Ship(); // 自機オブジェクト作成
  back = document.getElementById("back");
  window.onpointermove = (e) => {
    ship.move(e.clientX, e.clientY); // マウス移動⇒自機を移動
  };
  window.onpointerdown = (e) => {
    ship.shoot(); // マウス押下⇒弾丸発射
  };
  timerId = setInterval(tick, 50); // タイマー開始
  for (let i = 0; i < 50; i++) {
    stars.push(new Star()); // 星を作成してリストに追加
  }
};

function tick() {
  count++;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 600, 600);
  ctx.drawImage(back, 0, 0);
  stars.forEach((s) => s.tick()); // 星の移動
  ship.tick();
  if (count % interval == 0) {
    enemies.push(new Enemy()); // intervalフレーム毎に敵を作成
    interval = Math.max(5, interval - 5);
  }
  let gameOver = false;
  enemies.forEach((e) => {
    e.tick(); // 敵を移動
    if (dist(e, ship) < 100) {
      gameOver = true; // 敵との距離が100未満⇒ゲームオーバー
    }
  });
  bullets.forEach((b) => {
    b.tick(); // 弾丸移動
    if (!b.isShip && dist(b, ship) < 30) {
      gameOver = true; // 弾丸との距離が30未満⇒ゲームオーバー
    }
  });
  let prevNum = enemies.length;
  enemies = enemies.filter((e) => {
    return !bullets.some((b) => {
      return b.isShip && dist(e, b) < 50; // 弾丸と敵の衝突判定
    });
  });
  score += prevNum - enemies.length;
  ctx.fillStyle = "yellow";
  ctx.fillText("SCORE:" + score, 100, 100);

  if (gameOver) {
    clearInterval(timerId);
    ctx.fillStyle = "yellow";
    ctx.fillText("GAME OVER", 200, 300);
  }
}

// 2つのオブジェクト間の距離を求める
function dist(e0, e1) {
  return Math.sqrt(
    Math.abs(e0.x -e1.x) ** 2 + Math.abs(e0.y - e1.y) ** 2
  );
}
