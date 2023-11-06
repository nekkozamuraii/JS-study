const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul")

const todos = JSON.parse(localStorage.getItem("todos"));

// ローカルストレージに保存されていればそれを表示
if (todos) {
  todos.forEach(todo => {
    add(todo);
  });
}

form.addEventListener("submit", function (event) { // イベント時（クリック）の処理を設定
  event.preventDefault(); // デフォルトのイベントが起こらないようにする（enterを押した際のリロード）
  console.log(input.value);
  add();
});

// これ以降は関数
function add(todo) {
  let todoText = input.value;

  if (todo) {
    todoText = todo.text;
  }

  if (todoText) { // 暗黙的型変換（todoText.length > 0でもいい）
    const li = document.createElement("li");
    li.innerText = todoText;
    li.classList.add("list-group-item");

    if (todo && todo.completed) {
      li.classList.add("text-decoration-line-through")
    }

    li.addEventListener("contextmenu", function (event) { // イベント時（右クリック）の処理を設定
      event.preventDefault(); // 右クリック時のメニュー表示をoffに
      li.remove(); // liを削除
      saveData(); // ローカルストレージにも反映
    });

    li.addEventListener("click", function () {
      li.classList.toggle("text-decoration-line-through");
      saveData();
    });

    ul.appendChild(li);
    input.value = ""; // 最後に中身を空に
    saveData();
  }
}

function saveData() {
  const lists = document.querySelectorAll("li");
  let todos = [];

  lists.forEach(list => {
    let todo = {
      text: list.innerText,
      completed: list.classList.contains("text-decoration-line-through")
    };
    todos.push(todo);
  });
  localStorage.setItem("todos", JSON.stringify(todos)); // ローカルストレージは文字列で保存される
}
