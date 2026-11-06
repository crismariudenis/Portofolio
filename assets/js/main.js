// Renders content.js into the page.
const { profile, sections, footer } = window.PORTFOLIO;

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.flat().filter(Boolean));
  return node;
}

function renderLinks(links = []) {
  const visible = links.filter((link) => link.url);
  if (!visible.length) return null;
  return el("ul", { className: "links" },
    visible.map((link) => el("li", {}, el("a", { href: link.url, textContent: link.label }))));
}

function renderTags(tags = []) {
  if (!tags.length) return null;
  return el("ul", { className: "tags" }, tags.map((tag) => el("li", { textContent: tag })));
}

function renderMedia(media = []) {
  if (!media.length) return null;
  return el("div", { className: "media" }, media.map((entry) => {
    if (entry.explainer) {
      return el("details", { className: "explainer" },
        el("summary", { textContent: "How to read these charts" }),
        el("div", { className: "explainer__body" },
          entry.explainer.map((part) => el("div", {},
            el("h4", { textContent: part.title }),
            el("p", { textContent: part.text })))));
    }
    if (entry.chart) {
      return el("figure", {}, window.renderChart(window.PORTFOLIO_CHARTS[entry.chart]),
        entry.caption && el("figcaption", { textContent: entry.caption }));
    }
    if (entry.fade) {
      return el("figure", {},
        el("div", { className: "fade" }, entry.fade.map((layer) => el("div", { className: "fade__layer" },
          el("img", { src: layer.src, alt: layer.alt || "", loading: "lazy" }),
          el("span", { className: "fade__label", textContent: layer.label })))),
        entry.caption && el("figcaption", { textContent: entry.caption }));
    }
    const isVideo = /\.(mp4|webm)$/i.test(entry.src);
    const content = isVideo
      ? el("video", {
        src: entry.src, poster: entry.poster || "", ariaLabel: entry.alt || "",
        controls: true, muted: true, loop: true, playsInline: true, preload: "none",
      })
      : el("img", { src: entry.src, alt: entry.alt || "", loading: "lazy" });
    return el("figure", {}, content, entry.caption && el("figcaption", { textContent: entry.caption }));
  }));
}

// Muted clips play while on screen, unless the visitor prefers reduced motion.
function autoplayVideos() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    }
  }, { threshold: 0.4 });
  document.querySelectorAll(".media video").forEach((video) => observer.observe(video));
}

function renderItem(item, level = 3) {
  const classes = [level === 3 ? "entry" : "entry entry--child", item.layout === "side" && "entry--side"];
  const media = renderMedia(item.media);
  const head = [
    el("div", { className: "entry__head" },
      el(`h${level}`, { textContent: item.title }),
      item.meta && el("p", { className: "entry__meta", textContent: item.meta })),
    item.subtitle && el("p", { className: "entry__subtitle", textContent: item.subtitle }),
  ];
  const details = [
    item.text && el("p", { textContent: item.text }),
    item.bullets && el("ul", { className: "bullets" }, item.bullets.map((b) => el("li", { textContent: b }))),
    renderTags(item.tags),
    renderLinks(item.links),
    ...(item.children || []).map((child) => renderItem(child, level + 1)),
  ];
  const className = classes.filter(Boolean).join(" ");
  if (item.layout === "side") {
    return el("article", { className }, media, el("div", { className: "entry__body" }, head, details));
  }
  return el("article", { className }, head, media, details);
}

function renderHero() {
  const canvas = el("canvas", {
    className: "genome__canvas",
    role: "img",
    ariaLabel: "The neural network evolved for the thesis, drawn one connection at a time from its inputs to its movement and shooting outputs.",
  });
  const caption = el("figcaption", { className: "genome__caption" });
  caption.setAttribute("aria-hidden", "true");

  const hero = el("section", { className: "hero" },
    el("div", { className: "hero__text" },
      profile.photo && el("img", {
        className: "hero__photo", src: profile.photo, alt: profile.photoAlt || "", width: 160, height: 160,
      }),
      el("h1", { textContent: profile.name }),
      el("p", { className: "hero__headline", textContent: profile.headline }),
      el("p", { className: "hero__summary", textContent: profile.summary }),
      renderTags(profile.focus),
      el("p", { className: "hero__location", textContent: profile.location }),
      renderLinks(profile.links)),
    el("figure", { className: "genome" }, canvas, caption));

  return { hero, canvas, caption };
}

function renderSection(section, index) {
  return el("section", { className: "section", id: section.id },
    el("h2", { className: "section__label" },
      el("span", { className: "section__number", textContent: String(index + 1).padStart(2, "0") }),
      section.label),
    el("div", { className: "section__content" },
      section.intro && el("p", { className: "section__intro", textContent: section.intro }),
      el("div", { className: section.compact ? "section__body section__body--compact" : "section__body" },
        section.items.map((item) => renderItem(item)))));
}

const { hero, canvas, caption } = renderHero();
document.querySelector("#app").append(hero, ...sections.map(renderSection));

function renderTopbar(topbar) {
  const menu = el("button", { className: "topbar__menu", type: "button", textContent: "Menu" });
  menu.setAttribute("aria-controls", "site-nav");
  menu.setAttribute("aria-expanded", "false");

  function setOpen(open) {
    topbar.classList.toggle("topbar--open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
  }
  menu.addEventListener("click", () => setOpen(!topbar.classList.contains("topbar--open")));

  const nav = el("nav", { id: "site-nav", ariaLabel: "Sections" },
    sections.map((s) => el("a", { href: `#${s.id}`, textContent: s.label })));
  nav.addEventListener("click", () => setOpen(false));
  document.addEventListener("click", (event) => {
    if (!topbar.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && topbar.classList.contains("topbar--open")) {
      setOpen(false);
      menu.focus();
    }
  });

  topbar.append(el("a", { className: "topbar__name", href: "#app", textContent: profile.name }), menu, nav);
}

renderTopbar(document.querySelector("#topbar"));

document.querySelector("#footer").append(
  el("p", { textContent: `© ${new Date().getFullYear()} ${profile.name}` }),
  renderLinks(footer.links));

window.startGenome(canvas, caption);
autoplayVideos();
