const ph =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f1d3d9"/><text x="50" y="62" font-size="40" text-anchor="middle">&#10084;</text></svg>',
  );
const $ = (id) => document.getElementById(id);
$("open").onclick = () => {
  $("envelope").classList.add("gone");
  setTimeout(() => {
    $("paper").classList.add("down");
  }, 300);
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
