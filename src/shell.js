// Shared studio-page renderer — served from studios.appneural.com and loaded
// by every studio's site/index.html. Each studio ships only site/data.json;
// this file is the one place that knows how to turn that data into a page.
const ORG = "APPNEURAL-Studios";
const GALLERY_URL = "https://studios.appneural.com";

// The 14 platform-baseline services are identical for every app & studio, so
// they live here rather than being repeated in each studio's data.json.
const BASELINE = [
  "gateway-service", "authentication-service", "identity-service", "access-service",
  "security-service", "audit-service", "observability-service", "control-service",
  "deployment-service", "integration-service", "storage-service", "reporting-service",
  "analytics-service", "notification-service",
];

const STATUS_CLASS = { core: "svc", new: "svc st-new", gap: "svc st-gap" };

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) node.appendChild(child);
  return node;
}

function renderEditors(editors) {
  const categories = [...new Set(editors.map((e) => e.category))];
  const section = el("section");
  section.appendChild(el("h2", { text: `Editors (${editors.length})` }));

  for (const cat of categories) {
    if (categories.length > 1) section.appendChild(el("div", { class: "cat", text: cat }));
    const list = el("div", { class: "editor-list" });
    editors
      .filter((e) => e.category === cat)
      .forEach((e) => {
        const card = el("div", { class: "editor-card" });
        card.appendChild(el("div", { class: "name", text: e.name }));
        card.appendChild(el("p", { class: "desc", text: e.desc }));
        list.appendChild(card);
      });
    section.appendChild(list);
  }
  return section;
}

function renderServices(services) {
  const section = el("section");
  section.appendChild(el("h2", { text: "Microservices Used" }));
  section.appendChild(
    el("p", { class: "baseline-note", text: "Platform baseline (common to every app & studio):" })
  );
  const baselineList = el("div", { class: "svc-list" });
  BASELINE.forEach((b) => baselineList.appendChild(el("span", { class: "svc", text: b })));
  section.appendChild(baselineList);

  section.appendChild(
    el("p", {
      class: "baseline-note",
      style: "margin-top:18px;",
      text: `Functional services (${services.length}):`,
    })
  );
  const svcList = el("div", { class: "svc-list" });
  services.forEach(([name, status]) =>
    svcList.appendChild(el("span", { class: STATUS_CLASS[status] || "svc", text: `${name}-service` }))
  );
  section.appendChild(svcList);
  return section;
}

async function main() {
  const app = document.getElementById("app");
  let data;
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error(`data.json ${res.status}`);
    data = await res.json();
  } catch (err) {
    app.innerHTML = "";
    app.appendChild(el("p", { class: "loading", text: "Couldn't load this studio's data." }));
    return;
  }

  document.title = `${data.title} — APPNEURAL`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", data.description);

  app.innerHTML = "";
  app.appendChild(el("span", { class: "eyebrow", text: "APPNEURAL Studios" }));
  app.appendChild(el("h1", { text: data.title }));
  app.appendChild(el("p", { class: "tagline", text: data.tagline }));
  app.appendChild(el("p", { class: "desc", text: data.description }));

  const links = el("div", { class: "grid-links" });
  links.appendChild(el("a", { class: "primary", href: GALLERY_URL, text: "All Studios" }));
  links.appendChild(
    el("a", { href: `https://github.com/${ORG}/${data.slug}`, text: "GitHub Repo" })
  );
  app.appendChild(links);

  app.appendChild(renderEditors(data.editors));
  app.appendChild(renderServices(data.services));

  const footer = el("footer");
  footer.appendChild(document.createTextNode(" "));
  const link = el("a", { href: GALLERY_URL, text: "studios.appneural.com" });
  footer.insertBefore(link, footer.firstChild);
  footer.appendChild(document.createTextNode(" · part of the APPNEURAL platform"));
  app.appendChild(footer);
}

main();
