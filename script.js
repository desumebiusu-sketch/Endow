const monthYear = document.getElementById("month-year");
const calendarDays = document.getElementById("calendar-days");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const eventDate = document.getElementById("event-date");
const eventTitle = document.getElementById("event-title");
const addEventButton = document.getElementById("add-event");
const addWorkButton = document.getElementById("add-work-button");

let currentDate = new Date();


let events = JSON.parse(localStorage.getItem("endow-events")) || {};

// 古い予定データを新しい形式に変換する
Object.keys(events).forEach(dateKey => {
  events[dateKey] = events[dateKey].map(event => {
    if (typeof event === "string") {
      return {
        title: event,
        hours: event === "バイト" ? 5 : null
      };
    }
    return event;
  });
});


function saveEvents() {
  localStorage.setItem("endow-events", JSON.stringify(events));
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = `${year}年 ${month + 1}月`;

  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 月初めまでの空白
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day", "empty");
    calendarDays.appendChild(emptyDay);
  }

  // 日付を作る
  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dateKey =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // 日付の数字
    const numberElement = document.createElement("div");
    numberElement.textContent = day;
    dayElement.appendChild(numberElement);

    
    // 予定がある場合だけ表示する
    if (events[dateKey]) {
      events[dateKey].forEach((event, index) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");

        // 予定の文字
        const eventText = document.createElement("span");
        eventText.textContent = event.title;

        eventElement.appendChild(eventText);

        // バイトの場合は勤務時間の変更ボタンを表示
        if (event.title === "バイト") {
          const hoursText = document.createElement("span");
          hoursText.textContent = ` ${event.hours}時間 `;
          eventElement.appendChild(hoursText);

          // －ボタン
          const minusButton = document.createElement("button");
          minusButton.textContent = "−";
          minusButton.addEventListener("click", (e) => {
            e.stopPropagation();

            if (event.hours > 0) {
              event.hours--;
              saveEvents();
              renderCalendar();
            }
          });

          // ＋ボタン
          const plusButton = document.createElement("button");
          plusButton.textContent = "＋";
          plusButton.addEventListener("click", (e) => {
            e.stopPropagation();

            event.hours++;
            saveEvents();
            renderCalendar();
          });

          eventElement.appendChild(minusButton);
          eventElement.appendChild(plusButton);
        }

        // ×ボタン
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.classList.add("delete-event");

        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation();

          if (confirm(`「${event.title}」を削除しますか？`)) {
            events[dateKey].splice(index, 1);

            if (events[dateKey].length === 0) {
              delete events[dateKey];
            }

            saveEvents();
            renderCalendar();
          }
        });

        eventElement.appendChild(deleteButton);
        dayElement.appendChild(eventElement);
      });
    }

    // 日付をクリックしたら入力欄に日付を入れる
    dayElement.addEventListener("click", () => {
      eventDate.value = dateKey;
    });


    calendarDays.appendChild(dayElement);
  }
}

// 予定を追加
addEventButton.addEventListener("click", () => {
  const date = eventDate.value;
  const title = eventTitle.value.trim();

  if (!date) {
    alert("日付を選択してください");
    return;
  }

  if (!title) {
    alert("予定を入力してください");
    return;
  }

  if (!events[date]) {
    events[date] = [];
  }

 events[date].push({ title: title, hours: null });

  saveEvents();

  eventTitle.value = "";

  renderCalendar();

  alert("予定を追加しました！");
});

// バイトを追加
addWorkButton.addEventListener("click", () => {
  const date = eventDate.value;

  if (!date) {
    alert("バイトの日付を選択してください");
    return;
  }

  if (!events[date]) {
    events[date] = [];
  }

  events[date].push({ title: "バイト", hours: 5 });
  saveEvents();
  renderCalendar();

  alert("バイトを追加しました！");
});

// 前の月
prevButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

// 次の月
nextButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// カレンダーを表示
renderCalendar();

// 給料計算

function calculateSalary() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  let days = 0;
  let totalHours = 0;

  // 今表示している月のバイトだけを数える
  Object.keys(events).forEach(dateKey => {
    const [eventYear, eventMonth] = dateKey.split("-");

    if (
      Number(eventYear) === year &&
      Number(eventMonth) === month
    ) {
      events[dateKey].forEach(event => {
        if (event.title === "バイト") {
          days++;
          totalHours += event.hours;
        }
      });
    }
  });

  const wage = Number(document.getElementById("wage").value);
  const salary = totalHours * wage;

  document.getElementById("result").textContent =
    `今月のバイト日数：${days}日\n` +
    `今月の勤務時間：${totalHours}時間\n` +
    `給料は ${salary.toLocaleString()}円です！`;
}

// ====================
// 画面切り替え
// ====================

const calendarButton = document.getElementById("calendar-button");
const todoButton = document.getElementById("todo-button");

const calendarScreen = document.getElementById("calendar-screen");
const todoScreen = document.getElementById("todo-screen");

// カレンダーを表示
calendarButton.addEventListener("click", function() {
  calendarScreen.style.display = "block";
  todoScreen.style.display = "none";
});

// ToDoリストを表示
todoButton.addEventListener("click", function() {
  calendarScreen.style.display = "none";
  todoScreen.style.display = "block";
});
// ====================
// ToDoリスト
// ====================

const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const addTodoButton = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");

// 保存されているToDoを読み込む
let todos = JSON.parse(localStorage.getItem("endow-todos")) || [];

// ToDoを保存する
function saveTodos() {
  localStorage.setItem("endow-todos", JSON.stringify(todos));
}

// ToDoを表示する
function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {

    const listItem = document.createElement("li");

    // ToDoの文字
    const todoTextElement = document.createElement("span");
    todoTextElement.textContent = todo.text;

    if (todo.completed) {
      todoTextElement.classList.add("completed");
    }

    // 日付
    const dateElement = document.createElement("span");

    if (todo.date) {
      dateElement.textContent = "📅 " + todo.date;
    } else {
      dateElement.textContent = "📅 日付なし";
    }

    // 完了ボタン
    const completeButton = document.createElement("button");
    completeButton.textContent = "☑ 完了";

    completeButton.addEventListener("click", function() {
      todos[index].completed = !todos[index].completed;

      saveTodos();
      renderTodos();
    });

    // 削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑 削除";

    deleteButton.addEventListener("click", function() {
      todos.splice(index, 1);

      saveTodos();
      renderTodos();
    });

    listItem.appendChild(todoTextElement);
    listItem.appendChild(dateElement);
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);

    todoList.appendChild(listItem);
  });
}

// ToDoを追加
addTodoButton.addEventListener("click", function() {

  const todoTextValue = todoInput.value.trim();
  const todoDateValue = todoDate.value;

  if (!todoTextValue) {
    alert("ToDoを入力してください");
    return;
  }

  todos.push({
    text: todoTextValue,
    date: todoDateValue,
    completed: false
  });

  saveTodos();
  renderTodos();

  todoInput.value = "";
  todoDate.value = "";
});

// 最初にToDoを表示
renderTodos();


/* ====================
   バイト記録画面の切り替え
==================== */

const worklogButton = document.getElementById("worklog-button");
const worklogScreen = document.getElementById("worklog-screen");

calendarButton.addEventListener("click", function() {
  calendarScreen.style.display = "block";
  todoScreen.style.display = "none";
  worklogScreen.style.display = "none";
});

todoButton.addEventListener("click", function() {
  calendarScreen.style.display = "none";
  todoScreen.style.display = "block";
  worklogScreen.style.display = "none";
});

worklogButton.addEventListener("click", function() {
  calendarScreen.style.display = "none";
  todoScreen.style.display = "none";
  worklogScreen.style.display = "block";
});
