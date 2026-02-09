const ANSWERS = {
  c1: { type: "text", value: "ассоциации сс дас книту", next: "c2", input: "q1" },
  c2: { type: "text", value: "3", next: "c3", input: "q2" },
  c3: { type: "text", value: "розы", next: "c4", input: "q3" },
  c4: { type: "text", value: "23", next: "c5", input: "q4" },
  c5: { type: "text", value: "головоломка 2", next: "c6", input: "q5" },
  c6: { type: "text", value: "4", next: "final", input: "q6" }
};

// Helpers
const normaliseText = (s) => (s || "").trim().toLowerCase();

function unlockChapter(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // 1) Сразу делаем доступной
  el.classList.remove("locked");
  el.dataset.locked = "false";

  // 2) Запускаем "разбитие"
  el.classList.add("breaking");

  // 3) После анимации окончательно убираем стекло
  setTimeout(() => {
    el.classList.remove("breaking");
    el.classList.add("revealed");
  }, 750);
}

function isLocked(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  return el.dataset.locked === "true" || el.classList.contains("locked");
}

function scrollToChapter(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showError(chapterEl, show) {
  const err = chapterEl.querySelector(".error");
  if (!err) return;
  err.hidden = !show;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;

  if (action === "to-top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (action !== "unlock") return;

  const nextId = btn.dataset.for;          // e.g. c2
  const chapterEl = btn.closest(".chapter");
  if (!chapterEl) return;

  const currentId = chapterEl.id;
  const rule = ANSWERS[currentId];
  if (!rule) return;

  const input = document.getElementById(rule.input);
  if (!input) return;

  // Check answer
  let ok = false;

  if (rule.type === "date") {
    ok = (input.value || "").trim() === rule.value;
  } else {
    ok = normaliseText(input.value) === rule.value;
  }

  if (!ok) {
    showError(chapterEl, true);
    // tiny shake feedback
    chapterEl.animate(
      [
        { transform: "translateX(0px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0px)" }
      ],
      { duration: 340, iterations: 1 }
    );
    return;
  }

  // Success
  showError(chapterEl, false);

  unlockChapter(nextId);

  // Optional: lock scrolling to only unlocked? Not needed because locked blocks are blurred and non-interactive.
  // Scroll to next
  setTimeout(() => scrollToChapter(nextId), 180);
});

// Optional: prevent jumping into locked sections via manual scroll? (not necessary)
// But we can add "snap" behaviour later if you want.