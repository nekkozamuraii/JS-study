"use strict";

let WeightData = [
  [30, -12, 0, -1, -1, 0, -12, 30],
  [-12, -15, -3, -3, -3, -3, -15, -12],
  [0, -3, 0, -1, -1, 0, -3, 0],
  [-1, -3, -1, -1, -1, -1, -3, -1],
  [-1, -3, -1, -1, -1, -1, -3, -1],
  [0, -3, 0, -1, -1, 0, -3, 0],
  [-12, -15, -3, -3, -3, -3, -15, -12],
  [30, -12, 0, -1, -1, 0, -12, 30],
]; // 重みづけデータ
let BLACK = 1; // 自分
let WHITE = 2; // PC
let data = []; // 盤データ（0:なし、1:黒、2:白）
let myTurn = false; // 自分の番か否か

// 初期化関数
function init() {
  let b = document.getElementById("board");
  for (let i = 0; i < 8; i++) {
    let tr = document.createElement("tr"); // 行を作成
    data[i] = [0, 0, 0, 0, 0, 0, 0, 0]; // i行目のデータ設定
    for (let j = 0; j < 8; j++) {
      let td = document.createElement("td"); // 列を作成
      td.className = "cell";
      td.id = "cell" + i + j;
      td.onclick = clicked; // クリック時のイベントハンドラ登録
      tr.appendChild(td);
    }
    b.appendChild(tr);
  }
  // 最初の4つの意思を配置
  put(3, 3, BLACK);
  put(4, 4, BLACK);
  put(3, 4, WHITE);
  put(4, 3, WHITE);
  update();
}

function update() {
  // 白/黒の数を数えて表示
  let numWhite = 0;
  let numBlack = 0;
  for (let x =0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (data[x][y] == WHITE) {
        numWhite++;
      }
      if (data[x][y] == BLACK) {
        numBlack++;
      }
    }
  }
  document.getElementById("numBlack").textContent = numBlack;
  document.getElementById("numWhite").textContent = numWhite;

  let blackFlip = canFlip(BLACK); // 黒反転できるか否か
  let whiteFlip = canFlip(WHITE); // 白反転できるか否か

  if (numWhite + numBlack == 64 || (!blackFlip && !whiteFlip)) {
    if (numWhite > numBlack) {
      document.getElementById("message").textContent = "白の勝ち!";
    } else if (numWhite < numBlack) {
      document.getElementById("message").textContent = "黒の勝ち!";
    } else {
      document.getElementById("message").textContent = "引き分け";
    }
    return
  }

  if (!blackFlip) {
    showMessage("黒スキップ");
    myTurn = false;
  } else if (!whiteFlip) {
    showMessage("白スキップ");
    myTurn = true;
  } else {
    myTurn = !myTurn;
  }
  if (!myTurn) {
    setTimeout(think, 1000); // 1秒間考えたふり
  }
}

// メッセージ(str)を2秒間表示
function showMessage(str) {
  document.getElementById("message").textContent = str;
  setTimeout(function () {
    document.getElementById("message").textContent = "";
  }, 2000);
}

// 盤上のセルクリック時のコールバック関数
function clicked(e) {
  if (!myTurn) {
    // PC考え中
    return;
  }
  let id = e.target.id;
  let i = parseInt(id.charAt(4));
  let j = parseInt(id.charAt(5));

  let flipped = getFlipCells(i, j, BLACK);
  if (flipped.length > 0) {
    for (let k = 0; k < flipped.length; k++) {
    put(flipped[k][0], flipped[k][1], BLACK);
    }
    put(i, j, BLACK);
    update();
  }
}

// (i, j)にcolor色の石を置く
function put(i, j, color) {
  let c = document.getElementById("cell" + i + j);
  c.textContent = "●";
  c.className = "cell " + (color == BLACK ? "black" : "white");
  data[i][j] = color;
}

// コンピューター思考関数
function think() {
  let highScore = -1000;
  let px = -1, py = -1;

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let tmpData = copyData();
      let flipped = getFlipCells(x, y, WHITE);
      if (flipped.length > 0) {
        for (let i = 0; i < flipped.length; i++) {
        let p = flipped[i][0];
        let q = flipped[i][1];
        tmpData[p][q] = WHITE;
        tmpData[x][y] = WHITE;
        }
        let score = calcWeightData(tmpData);
        if (score > highScore) {
          highScore = score;
          (px = x), (py = y);
        }
      }
    }
  }

  if (px >= 0 && py >= 0) {
    let flipped = getFlipCells(px, py, WHITE);
    if (flipped.length > 0) {
      for (let k = 0; k < flipped.length; k++) {
        put(flipped[k][0], flipped[k][1], WHITE);
      }
    }
    put(px, py, WHITE);
  }
  update();
}

// 重みづけ計算
function calcWeightData(tmpData) {
  let score = 0;
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (tmpData[x][y] == WHITE) {
        score += WeightData[x][y];
      }
    }
  }
  return score;
}

// 石テーブルデータをコピー
function copyData() {
  let tmpData = [];
  for (let x = 0; x < 8; x++) {
    tmpData[x] = [];
    for (let y = 0; y < 8; y++) {
      tmpData[x][y] = data[x][y];
    }
  }
  return tmpData;
}

// 挟める石があるか？
function canFlip(color) {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let flipped = getFlipCells(x, y, color);
      if (flipped.length > 0) {
        return true;
      }
    }
  }
  return false;
}

// (i,j)に石を置いたときに石を挟めるか？
function getFlipCells(i, j, color) {
  if (data[i][j] == BLACK || data[i][j] == WHITE) {
    return []; // すでに石があるときは何もしない
  }

  // 相手を挟めるか、左上、上、右上、左、右、左下、下、右下と順番に調査
  let dirs = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  let result = [];
  for (let p = 0; p < dirs.length; p++) {
    let flipped = getFlipCellsOneDir(i, j, dirs[p][0], dirs[p][1], color);
    result = result.concat(flipped);
  }
  return result;
}

// (i,j)に石を置いたときに、(dx,dy)方向で石を挟めるか？
function getFlipCellsOneDir(i, j, dx, dy, color) {
  let x = i + dx;
  let y = j + dy;
  let flipped = []; // 挟まれた石の配列

  if (
    x < 0 ||
    y < 0 ||
    x > 7 ||
    y > 7 ||
    data[x][y] == color ||
    data[x][y] == 0
  ) {
    return []; // 盤外、同色、空ならfalse（挟めない）
  }
  flipped.push([x, y]);

  while (true) {
    x += dx;
    y += dy;
    if (x < 0 || y < 0 || x > 7 || data[x][y] == 0) {
      return []; // 盤外、空ならfalse（挟めない）
    }
    if (data[x][y] == color) {
      return flipped; // 挟めた！
    } else {
      flipped.push([x, y]);
    }
  }
}