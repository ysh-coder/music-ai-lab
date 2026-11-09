const catalog = document.querySelector("#catalog");
const courses = document.querySelector("#courses");
const gradeButtons = Array.from(document.querySelectorAll("[data-grade]"));
const termButtons = Array.from(document.querySelectorAll("[data-term]"));
const lessonTemplate = document.querySelector("#lesson-template");
const lessonList = document.querySelector("#lesson-list");
const semesterCode = document.querySelector("#semester-code");
const semesterTitle = document.querySelector("#semester-title");
const semesterMeta = document.querySelector("#semester-meta");
const instrumentNotes = document.querySelector("#instrument-notes");
const notesList = document.querySelector("#notes-list");

const gradeLabels = ["中一", "中二", "中三"];
const termLabels = ["上學期", "下學期"];
let grade = 1;
let term = 1;
let renderedSemester = "";

function renderSemester() {
  const key = `s${grade}-t${term}`;
  if (key === renderedSemester) return;
  const semester = musicSemesters[key];
  if (!semester) return;
  renderedSemester = key;
  gradeButtons.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.grade) === grade)));
  termButtons.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.term) === term)));

  const label = `${gradeLabels[grade - 1]}${termLabels[term - 1]}`;
  semesterCode.textContent = `S${grade} / TERM 0${term}`;
  semesterTitle.textContent = semester.title;
  semesterMeta.textContent = `${label} · ${semester.lessons.length} 份工作紙`;

  lessonList.replaceChildren();
  if (semester.lessons.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "這個學期暫未有工作紙。可先參考下方的樂器筆記。";
    lessonList.append(empty);
    return;
  }

  const list = document.createDocumentFragment();
  semester.lessons.forEach((lesson, index) => {
    const row = lessonTemplate.content.cloneNode(true);
    row.querySelector(".lesson-number").textContent = `工作紙 ${String(index + 1).padStart(2, "0")}`;
    row.querySelector(".lesson-title").textContent = lesson.title;
    row.querySelector(".lesson-tag").textContent = lesson.tag;
    row.querySelector(".lesson-goal").textContent = lesson.goal;
    row.querySelector(".lesson-activity").textContent = lesson.activity;
    if (typeof lesson.resource === "string" && lesson.resource.startsWith("https://")) {
      const resource = row.querySelector(".resource-link");
      resource.href = lesson.resource;
      resource.hidden = false;
    }
    list.append(row);
  });
  lessonList.append(list);
}

function renderNotes() {
  for (const group of musicNotes) {
    const details = document.createElement("details");
    details.className = "note-group";
    const heading = document.createElement("summary");
    heading.textContent = `${group.title} · ${group.entries.length} 份筆記`;
    details.append(heading);
    const list = document.createElement("ul");
    for (const [title, id] of group.entries) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = driveFile(id);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${title}（PDF）`;
      item.append(link);
      list.append(item);
    }
    details.append(list);
    notesList.append(details);
  }
  instrumentNotes.hidden = false;
}

function readSemesterLink() {
  const match = /^#s([1-3])-t([1-2])$/.exec(location.hash);
  if (!match) return false;
  grade = Number(match[1]);
  term = Number(match[2]);
  renderSemester();
  return true;
}

function selectSemester(nextGrade, nextTerm) {
  if (grade === nextGrade && term === nextTerm) return;
  grade = nextGrade;
  term = nextTerm;
  renderSemester();
  history.pushState(null, "", `#s${grade}-t${term}`);
}

gradeButtons.forEach((button) => {
  button.addEventListener("click", () => selectSemester(Number(button.dataset.grade), term));
});
termButtons.forEach((button) => {
  button.addEventListener("click", () => selectSemester(grade, Number(button.dataset.term)));
});
window.addEventListener("popstate", () => {
  if (readSemesterLink()) return;
  if (!location.hash || location.hash === "#courses") {
    grade = 1;
    term = 1;
    renderSemester();
  }
});
window.addEventListener("hashchange", readSemesterLink);
renderNotes();
catalog.hidden = false;
if (readSemesterLink()) courses.scrollIntoView();
else renderSemester();

const journey = document.querySelector(".journey");
const stage = document.querySelector(".hero-stage");
const portal = document.querySelector(".portal");
const enter = document.querySelector("#enter-room");
const arrival = document.querySelector("#arrival");
const roomCamera = document.querySelector(".arrival-camera");
const arrivalLink = document.querySelector("#arrival-link");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => value * value * (3 - 2 * value);
const phase = (progress, start, end) => ease(clamp((progress - start) / (end - start)));
let distance = 1;
let frame = 0;
let entranceScrollFrame = 0;

function drawGuide(progress, opening) {
  const turn = phase(progress, .08, .21);
  const approach = phase(progress, .05, .29);
  const crossing = phase(progress, .46, .75);
  const turnInside = phase(progress, .46, .57);
  const walking = phase(progress, .44, .88);
  const settle = phase(progress, .89, .98);
  const stride = walking * Math.PI * 6;
  const alternate = Number(Math.cos(stride) < 0);
  const facingFront = Number(turn < .5);
  const facingAway = Number(turnInside >= .5);
  const roomGreeting = Number(settle >= .5);
  const roomWalk = phase(progress, .67, .93);

  const poses = {
    "--portal-guide-offset": .32 - .14 * approach - .18 * crossing,
    "--portal-guide-floor": `${7 + 9 * approach + 9 * crossing}%`,
    "--portal-guide-scale": 1 - .06 * approach - .20 * crossing,
    "--portal-guide-light": .84 + .15 * opening,
    "--portal-guide-opacity": 1 - phase(progress, .69, .77),
    "--portal-greet": facingFront,
    "--portal-push": (1 - facingFront) * (1 - facingAway),
    "--portal-step-a": facingAway * (1 - alternate),
    "--portal-step-b": facingAway * alternate,
    "--guide-lift": `${-Math.abs(Math.sin(stride)) * 2 * facingAway * (1 - settle)}px`,
    "--room-guide-opacity": phase(progress, .71, .8),
    "--room-guide-x": `${60 - 4 * roomWalk}%`,
    "--room-guide-floor": `${9 + 8 * roomWalk}%`,
    "--room-guide-scale": .94 - .21 * roomWalk,
    "--room-greet": roomGreeting,
    "--room-step-a": (1 - roomGreeting) * (1 - alternate),
    "--room-step-b": (1 - roomGreeting) * alternate
  };
  Object.entries(poses).forEach(([property, value]) => stage.style.setProperty(property, value));
}

function drawEntrance() {
  frame = 0;
  const active = !motionPreference.matches;
  const progress = active ? clamp((window.scrollY - journey.offsetTop) / distance) : 0;
  const opening = phase(progress, .23, .57);
  const entering = phase(progress, .58, .87);
  const arrived = progress >= .87;
  const handOverFocus = arrived && !stage.classList.contains("is-arrived") && document.activeElement === enter;
  stage.style.setProperty("--walk", progress);
  stage.style.setProperty("--open", opening);
  stage.style.setProperty("--seam", 1 - clamp(opening * 9));
  stage.style.setProperty("--zoom", 1 + .24 * phase(progress, .3, .73));
  stage.style.setProperty("--entrance-copy", 1 - phase(progress, .57, .84));
  stage.style.setProperty("--arrive", entering);
  stage.style.setProperty("--arrival-zoom", 1 + entering * .1);
  drawGuide(progress, opening);
  stage.classList.toggle("is-arrived", arrived);
  arrival.toggleAttribute("inert", !arrived);
  arrival.setAttribute("aria-hidden", String(!arrived));
  if (handOverFocus) arrivalLink.focus({ preventScroll: true });
}

function requestEntranceFrame() {
  if (!frame) frame = requestAnimationFrame(drawEntrance);
}

function measureEntrance() {
  distance = Math.max(1, journey.offsetHeight - stage.offsetHeight);
  const doorWidth = portal.clientHeight * .69;
  const roomWidth = roomCamera.clientHeight * 1.5;
  portal.style.setProperty("--door-fit-width", `${doorWidth}px`);
  roomCamera.style.setProperty("--room-fit-width", `${roomWidth}px`);
  requestEntranceFrame();
}

function updateMotion() {
  stopEntranceScroll();
  document.documentElement.classList.toggle("motion-enabled", !motionPreference.matches);
  measureEntrance();
}

function stopEntranceScroll() {
  if (!entranceScrollFrame) return;
  cancelAnimationFrame(entranceScrollFrame);
  entranceScrollFrame = 0;
}

enter.addEventListener("click", (event) => {
  if (motionPreference.matches || distance <= 1 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  event.preventDefault();
  stopEntranceScroll();
  const from = window.scrollY;
  const target = () => journey.offsetTop + distance - 1;
  const duration = 650 + 1050 * clamp((target() - from) / distance);
  let started;

  function advance(now) {
    if (started === undefined) started = now;
    const time = clamp((now - started) / duration);
    window.scrollTo(0, from + (target() - from) * ease(time));
    entranceScrollFrame = time < 1 ? requestAnimationFrame(advance) : 0;
  }
  entranceScrollFrame = requestAnimationFrame(advance);
});
["wheel", "touchstart", "pointerdown", "keydown"].forEach((type) => {
  window.addEventListener(type, stopEntranceScroll, { passive: true });
});
window.addEventListener("scroll", requestEntranceFrame, { passive: true });
window.addEventListener("resize", measureEntrance);
window.addEventListener("load", measureEntrance);
window.addEventListener("pageshow", measureEntrance);
if (motionPreference.addEventListener) motionPreference.addEventListener("change", updateMotion);
else motionPreference.addListener(updateMotion);
updateMotion();
