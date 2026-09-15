const monthYear = document.getElementById("month-year");
const calendarDays = document.getElementById("calendar-days");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const eventDate = document.getElementById("event-date");
const eventTitle = document.getElementById("event-title");
const addEventButton = document.getElementById("add-event");

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

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day", "empty");
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dateKey =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const numberElement = document.createElement("div");
    numberElement.textContent = day;

    dayElement.appendChild(numberElement);

    if (events[dateKey]) {
      events[dateKey].forEach((event) => {
        const eventElement = document.createElement("div");

        eventElement.classList.add("event");
        eventElement.textContent = event;

        dayElement.appendChild(eventElement);
      });
    }

    dayElement.addEventListener("click", () => {
      eventDate.value = dateKey;
    });

    calendarDays.appendChild(dayElement);
  }
}

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

prevButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
function calculateSalary() {
  const days = Number(document.getElementById("days").value);
  const hours = Number(document.getElementById("hours").value);
  const wage = Number(document.getElementById("wage").value);

  const salary = days * hours * wage;

  document.getElementById("result").textContent =
    `給料は ${salary.toLocaleString()}円です！`;
}