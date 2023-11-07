const quiz = [
  {
  question: "好きな果物は",
  answers: ["りんご", "みかん", "もも", "ぶどう"],
  correct: "みかん"
  }, {
  question: "実家のペットの名前は",
  answers: ["ミミ", "ネッコ", "イッヌ", "カッメ"],
  correct: "ミミ"
  }, {
  question: "好きな食べ物",
  answers: ["ラーメン", "うどん", "そば", "牛丼"],
  correct: "ラーメン"
  }
]

let quizIndex = 0;
let score = 0;
const quizLength = quiz.length;
const $button = document.getElementsByTagName("button"); // はHTMLのオブジェクトを取ってくる場合、＄を先頭につける

// クイズの問題文、選択肢を定義
const setupQuiz = () => {
  document.getElementById("js-question").textContent = quiz[quizIndex].question; // divタグが複数あるのでidで取得
  for (let i = 0; i < $button.length; i++) {
    $button[i].textContent = quiz[quizIndex].answers[i];
  }
};
setupQuiz();

// 回答の正誤判定の定義（次の問題への遷移も）
const clickHandler = (e) => {
  if(quiz[quizIndex].correct === e.target.textContent){ // eはイベント、targetはクリックされた時の対象
    window.alert("正解！");
    score++;
  } else {
    window.alert("不正解！");
  }

  quizIndex++;

  if(quizIndex < quizLength) {
    // 問題数がまだあればこちらを実行
    setupQuiz();
  } else {
    // 問題数がもうなければ終了
    window.alert("終了！あなたの正解数は" + score + "/" + quiz.length + "です。");
  }
};

for (let i = 0; i < $button.length; i++) {
  $button[i].addEventListener("click", (e) => {
    clickHandler(e);
  })
};
