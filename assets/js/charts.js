// Renders a chart from assets/data/plane-charts.js: a connected scatter drawn at the container's real size.
// Time is not on an axis, so the Replay button reveals the evaluations in training order on one clock.
window.renderChart = function renderChart(config) {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const HIT_RADIUS = 32;
  const TICK_MS = 280;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function svg(tag, attrs = {}, text) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function scale(axis, from, to) {
    const map = axis.log ? Math.log10 : (v) => v;
    return (v) => from + ((map(v) - map(axis.min)) / (map(axis.max) - map(axis.min))) * (to - from);
  }

  const all = config.series.flatMap((series) => series.points.map((point) => ({ point, series })));
  const timeline = [...new Set(all.map(({ point }) => point.steps))].sort((a, b) => a - b);

  const svgRoot = svg("svg", { role: "img", "aria-label": config.label, tabindex: 0 });
  const tip = el("div", { className: "chart__tip", hidden: true });
  const plot = el("div", { className: "chart__plot" });
  plot.append(svgRoot, tip);

  const clockText = el("span", { className: "chart__clock" });
  const playButton = el("button", { className: "chart__play", type: "button", textContent: "▶ Replay training" });

  // One series is named by the title, so it needs no legend.
  const legend = config.series.length > 1 && el("ul", { className: "chart__legend" },
    config.series.map((series) => {
      const key = el("span", { className: "chart__key" });
      key.style.background = `var(${series.color})`;
      return el("li", {}, key, series.name);
    }));

  const table = el("table", {},
    el("thead", {}, el("tr", {}, config.columns.map((c) => el("th", { scope: "col", textContent: c.label })))),
    el("tbody", {}, all.map(({ point, series }) =>
      el("tr", {}, config.columns.map((c) => el("td", { textContent: String(c.value(point, series)) }))))));
  const details = el("details", { className: "chart__table" },
    el("summary", { textContent: "Data table" }),
    el("div", { className: "chart__scroll" }, table));

  let px;
  let py;
  let highlight;
  let active = -1;
  let clock = Infinity;
  let timer = null;

  function drawLines(x, y, lines, attrs) {
    const text = svg("text", { ...attrs, x, y });
    lines.forEach((line, i) => text.append(svg("tspan", { x, dy: i === 0 ? 0 : 13 }, line)));
    svgRoot.append(text);
  }

  function draw() {
    const width = plot.clientWidth;
    if (!width) return;
    // Phones get a taller plot, so the corner labels and the data don't overlap.
    const phone = window.matchMedia("(max-width: 600px)").matches;
    const height = Math.round(width * (phone ? 1.35 : 0.8));
    const m = { top: 12, right: 14, bottom: 60, left: 56 };
    const left = m.left;
    const right = width - m.right;
    const top = m.top;
    const bottom = height - m.bottom;

    px = scale(config.x, left, right);
    py = scale(config.y, bottom, top);

    svgRoot.replaceChildren();
    svgRoot.setAttribute("width", width);
    svgRoot.setAttribute("height", height);
    svgRoot.setAttribute("viewBox", `0 0 ${width} ${height}`);

    if (config.target) {
      svgRoot.append(svg("rect", {
        class: "chart__target", x: left, y: top, width: px(config.target.xMax) - left, height: bottom - top,
      }));
    }

    for (const tick of config.y.ticks) {
      svgRoot.append(
        svg("line", { class: "chart__grid", x1: left, x2: right, y1: py(tick), y2: py(tick) }),
        svg("text", { class: "chart__tick", x: left - 8, y: py(tick) + 4, "text-anchor": "end" }, tick));
    }
    for (const tick of config.x.ticks) {
      svgRoot.append(svg("text", { class: "chart__tick", x: px(tick), y: bottom + 16, "text-anchor": "middle" }, tick));
    }
    svgRoot.append(
      svg("line", { class: "chart__axis", x1: left, x2: right, y1: bottom, y2: bottom }),
      svg("text", { class: "chart__note", x: left, y: bottom + 32 }, `← ${config.x.low}`),
      svg("text", { class: "chart__note", x: right, y: bottom + 32, "text-anchor": "end" }, `${config.x.high} →`),
      svg("text", { class: "chart__title", x: (left + right) / 2, y: height - 8, "text-anchor": "middle" }, config.x.label),
      svg("text", {
        class: "chart__title", "text-anchor": "middle",
        transform: `translate(14 ${(top + bottom) / 2}) rotate(-90)`,
      }, `${config.y.low} ← ${config.y.label} → ${config.y.high}`));

    for (const line of config.lines) {
      const isX = line.axis === "x";
      const at = isX ? px(line.value) : py(line.value);
      svgRoot.append(svg("line", isX
        ? { class: "chart__ref", x1: at, x2: at, y1: top, y2: bottom }
        : { class: "chart__ref", x1: left, x2: right, y1: at, y2: at }));
      svgRoot.append(svg("text", isX
        ? { class: "chart__note", x: at + 6, y: py(line.labelAt) }
        : { class: "chart__note", x: right - 4, y: at + 15, "text-anchor": "end" }, line.label));
    }

    const [topLeft, topRight, bottomLeft, bottomRight] = config.corners;
    const cornerLeft = (config.target ? px(config.target.xMax) : left) + 8;
    const cornerTop = top + 15;
    const cornerBottom = bottom - 22;
    drawLines(cornerLeft, cornerTop, topLeft, { class: "chart__note chart__note--corner" });
    drawLines(right - 6, cornerTop, topRight, { class: "chart__note chart__note--corner", "text-anchor": "end" });
    drawLines(cornerLeft, cornerBottom, bottomLeft, { class: "chart__note chart__note--corner" });
    drawLines(right - 6, cornerBottom, bottomRight, { class: "chart__note chart__note--corner", "text-anchor": "end" });

    for (const series of config.series) {
      const shown = series.points.filter((p) => p.steps <= clock);
      if (!shown.length) continue;
      const group = svg("g", { style: `color: var(${series.color})` });
      const pos = (p) => [px(p[config.x.field]), py(p[config.y.field])];

      shown.slice(1).forEach((point, i) => {
        const prev = shown[i];
        const [x1, y1] = pos(prev);
        const [x2, y2] = pos(point);
        const jump = prev.segment !== point.segment;
        group.append(svg("line", { class: jump ? "chart__line chart__line--jump" : "chart__line", x1, y1, x2, y2 }));
      });

      shown.forEach((point, i) => {
        const [cx, cy] = pos(point);
        group.append(svg("circle", { class: "chart__dot", cx, cy, r: i === shown.length - 1 ? 6.5 : 3.5 }));
      });
      svgRoot.append(group);

      const [startX, startY] = pos(shown[0]);
      const start = config.starts[series.name];
      svgRoot.append(svg("text", {
        class: "chart__note chart__note--start", x: startX + start.dx, y: startY + start.dy, "text-anchor": start.anchor,
      }, "Start"));

      const [endX, endY] = pos(shown[shown.length - 1]);
      const place = config.labels[series.name];
      svgRoot.append(svg("text", {
        class: "chart__label", x: endX + place.dx, y: endY + place.dy, "text-anchor": place.anchor,
      }, series.name));
    }

    highlight = svg("circle", { class: "chart__highlight", r: 9, visibility: "hidden" });
    svgRoot.append(highlight);
    if (active >= 0) show(active);
  }

  function show(index) {
    active = index;
    const { point, series } = all[index];
    const x = px(point[config.x.field]);
    const y = py(point[config.y.field]);
    highlight.setAttribute("cx", x);
    highlight.setAttribute("cy", y);
    highlight.setAttribute("visibility", "visible");

    tip.replaceChildren(
      el("strong", { textContent: config.tipTitle(point, series) }),
      ...config.columns.slice(2).map((c) => el("span", { textContent: `${c.label}: ${c.value(point, series)}` })));
    tip.hidden = false;

    const width = plot.clientWidth;
    tip.style.left = x > width / 2 ? "auto" : `${x + 14}px`;
    tip.style.right = x > width / 2 ? `${width - x + 14}px` : "auto";
    tip.style.top = `${Math.max(0, y - 20)}px`;
  }

  function hide() {
    active = -1;
    tip.hidden = true;
    if (highlight) highlight.setAttribute("visibility", "hidden");
  }

  function finish() {
    clearInterval(timer);
    timer = null;
    clock = Infinity;
    clockText.textContent = "";
    playButton.textContent = "▶ Replay training";
    draw();
  }

  function play() {
    clearInterval(timer);
    hide();
    let index = 0;
    playButton.textContent = "■ Stop";
    const step = () => {
      if (index >= timeline.length) return finish();
      clock = timeline[index];
      clockText.textContent = config.clockLabel(clock);
      index += 1;
      draw();
      return undefined;
    };
    step();
    timer = setInterval(step, TICK_MS);
  }

  playButton.addEventListener("click", () => {
    if (timer) finish();
    else play();
  });

  plot.addEventListener("pointermove", (event) => {
    const box = plot.getBoundingClientRect();
    const mx = event.clientX - box.left;
    const my = event.clientY - box.top;
    let best = -1;
    let bestDistance = HIT_RADIUS;
    all.forEach(({ point }, i) => {
      if (point.steps > clock) return;
      const d = Math.hypot(px(point[config.x.field]) - mx, py(point[config.y.field]) - my);
      if (d < bestDistance) {
        best = i;
        bestDistance = d;
      }
    });
    if (best >= 0) show(best);
    else hide();
  });
  plot.addEventListener("pointerleave", hide);

  svgRoot.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      if (timer) finish();
      const step = event.key === "ArrowRight" ? 1 : -1;
      show(active < 0 ? 0 : (active + step + all.length) % all.length);
    } else if (event.key === "Escape") {
      hide();
    }
  });
  svgRoot.addEventListener("blur", hide);

  new ResizeObserver(draw).observe(plot);

  // Plays once the first time the chart is on screen.
  if (!reducedMotion) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        play();
      }
    }, { threshold: 0.5 });
    observer.observe(plot);
  }

  return el("div", { className: "chart" },
    el("p", { className: "chart__heading", textContent: config.title }),
    el("div", { className: "chart__bar" }, legend, clockText, playButton),
    plot,
    details);
};
