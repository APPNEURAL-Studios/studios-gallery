const grid = document.getElementById("grid");
const search = document.getElementById("search");
const countEl = document.getElementById("count");
const emptyEl = document.getElementById("empty");
const emptyQ = document.getElementById("empty-q");

let studios = [];

function card(s) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener";
  a.innerHTML = `
    <div class="title">${s.title}</div>
    <div class="tagline">${s.tagline}</div>
    <div class="meta">
      <span>${s.editorCount} editors</span>
      <span>·</span>
      <span>${s.serviceCount} services</span>
    </div>
  `;
  return a;
}

function render(list) {
  grid.innerHTML = "";
  countEl.textContent = `${list.length} studio${list.length === 1 ? "" : "s"}`;
  emptyEl.hidden = list.length !== 0;
  list.forEach((s) => grid.appendChild(card(s)));
}

function filter(query) {
  const q = query.trim().toLowerCase();
  if (!q) return studios;
  return studios.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.slug.includes(q)
  );
}

search.addEventListener("input", () => {
  const q = search.value;
  emptyQ.textContent = q;
  render(filter(q));
});

fetch("./studios.json")
  .then((r) => r.json())
  .then((data) => {
    studios = data;
    render(studios);
  })
  .catch(() => {
    countEl.textContent = "Could not load studios.";
  });
