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
        eventText.textContent = event;

        // ×ボタン
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.classList.add("delete-event");

        // ×ボタンを押したとき
        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation();

          if (confirm(`「${event}」を削除しますか？`)) {
            events[dateKey].splice(index, 1);

            if (events[dateKey].length === 0) {
              delete events[dateKey];
            }

            saveEvents();
            renderCalendar();
          }
        });

        eventElement.appendChild(eventText);
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

  events[date].push(title);

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

  events[date].push("バイト");

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
  const days = Number(document.getElementById("days").value);
  const hours = Number(document.getElementById("hours").value);
  const wage = Number(document.getElementById("wage").value);

  const salary = days * hours * wage;

  document.getElementById("result").textContent =
    `給料は ${salary.toLocaleString()}円です！`;
}
