const openDoorBtn = document.getElementById("openDoorBtn");
const tinyNote = document.getElementById("tinyNote");

const modal = document.getElementById("modal");
const dateInput = document.getElementById("dateInput");
const errorText = document.getElementById("errorText");
const cancelBtn = document.getElementById("cancelBtn");
const openBtn = document.getElementById("openBtn");

const door = document.getElementById("door");

const CORRECT_ISO = "2024-10-31"; // for input[type=date]

function openModal() {
  errorText.hidden = true;
  tinyNote.hidden = true;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  setTimeout(() => dateInput.focus(), 50);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function isCorrectAnswer() {
  const picked = (dateInput.value || "").trim();
  return picked === CORRECT_ISO;
}

function success() {
  closeModal();
  window.location.href = "./main.html";
}

function fail() {
  errorText.hidden = false;
  tinyNote.hidden = false;

  door.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0px)" }
    ],
    { duration: 360, iterations: 1 }
  );
}

function triggerOpen() {
  openModal();
}

openDoorBtn.addEventListener("click", triggerOpen);
door.addEventListener("click", triggerOpen);
door.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    triggerOpen();
  }
});

openBtn.addEventListener("click", () => {
  if (isCorrectAnswer()) success();
  else fail();
});

// "На главную" = закрыть модалку, остаться на главной
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.dataset && t.dataset.close === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

dateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (isCorrectAnswer()) success();
    else fail();
  }
});