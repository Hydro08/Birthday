const ph =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f1d3d9"/><text x="50" y="62" font-size="40" text-anchor="middle">&#10084;</text></svg>',
  );
const $ = (id) => document.getElementById(id);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function unroll() {
  const scroll = $("scroll");
  const paper = $("paper");
  const roll = $("rollB");
  scroll.classList.add("show");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dur = reduce ? 1 : 2800;
  const t0 = performance.now();

  (function frame(now) {
    const p = ease(Math.min(Math.max((now - t0) / dur, 0), 1));
    const H = paper.offsetHeight;
    paper.style.clipPath = `inset(${-40 * p}px -20px ${H * (1 - p) - 40 * p}px -20px)`;
    roll.style.top = `${H * p}px`;

    const limit = window.innerHeight - 70;
    const bottom = roll.getBoundingClientRect().bottom;
    if (bottom > limit) window.scrollBy(0, bottom - limit);

    if (p < 1) requestAnimationFrame(frame);
    else paper.style.clipPath = "none";
  })(t0);
}

const bgm = $("bgm");
const muteBtn = $("mute");
const VOLUME = 0.6;

function startMusic() {
  bgm.volume = 0;
  const p = bgm.play();
  if (p && p.catch) p.catch(() => {});
  muteBtn.hidden = false;
  let v = 0;
  const fade = setInterval(() => {
    if (bgm.muted) return;
    v = Math.min(v + 0.03, VOLUME);
    bgm.volume = v;
    if (v >= VOLUME) clearInterval(fade);
  }, 200);
}

muteBtn.onclick = () => {
  bgm.muted = !bgm.muted;
  muteBtn.textContent = bgm.muted ? "🔇" : "🔊";
  muteBtn.setAttribute("aria-label", bgm.muted ? "Unmute music" : "Mute music");
};

$("open").onclick = () => {
  $("envelope").classList.add("gone");
  startMusic();
  setTimeout(unroll, 400);
};

function loadable(src) {
  return new Promise((resolve) => {
    const i = new Image();
    i.onload = () => resolve(src);
    i.onerror = () => resolve(null);
    i.src = src;
  });
}

async function slideshow(img, delay = 0) {
  const checked = await Promise.all(
    img.dataset.photos.split(",").map((s) => loadable(s.trim())),
  );
  const list = checked.filter(Boolean).slice(0, 5);
  if (!list.length) {
    img.src = ph;
    return;
  }
  img.src = list[0];
  if (list.length < 2) return;

  let n = 0;
  setTimeout(
    () =>
      setInterval(() => {
        n = (n + 1) % list.length;
        img.classList.add("fade");
        setTimeout(() => {
          img.src = list[n];
          img.classList.remove("fade");
        }, 800);
      }, 3000),
    delay,
  );
}

document
  .querySelectorAll(".photo img")
  .forEach((img, i) => slideshow(img, i * 1000));
