// Hero animation: a real network evolved for the thesis (assets/data/thesis-genome.js).
// Connections appear in innovation-number order, the order NEAT numbered them across the run.
window.startGenome = function startGenome(canvas, caption) {
  const STEP_MS = 420;
  const HOLD_MS = 7000;
  const HIGHLIGHT_FOR = 900;
  const PULSE_PERIOD = 1800;
  // Drawn rather than typed: the web font has only the vertical arrows, so typed ones come out in two sizes.
  const ARROW_ANGLES = { "↑": -Math.PI / 2, "←": Math.PI, "↓": Math.PI / 2, "→": 0 };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { nodes, edges: rawEdges } = window.THESIS_GENOME;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges = rawEdges.map((edge, i) => ({ ...edge, from: byId.get(edge.a), to: byId.get(edge.b), phase: (i * 0.381) % 1 }));
  const hiddenTotal = nodes.filter((node) => node.x > 0 && node.x < 1).length;
  const groups = [...new Set(nodes.filter((node) => node.group).map((node) => node.group))].map((name) => {
    const ys = nodes.filter((node) => node.group === name).map((node) => node.y);
    return { name, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  });

  let shown = reducedMotion ? edges.length : 0;
  let lastStep = -Infinity;
  let bornAt = edges.map(() => -Infinity);
  let visible = true;

  function step(now) {
    if (shown < edges.length) {
      if (now - lastStep < STEP_MS) return;
      bornAt[shown] = now;
      shown += 1;
      lastStep = now;
    } else if (now - lastStep > HOLD_MS) {
      shown = 0;
      bornAt = edges.map(() => -Infinity);
    }
  }

  function draw(now) {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * ratio)) canvas.width = Math.round(width * ratio);
    if (canvas.height !== Math.round(height * ratio)) canvas.height = Math.round(height * ratio);

    const ctx = canvas.getContext("2d");
    const styles = getComputedStyle(canvas);
    const positive = styles.getPropertyValue("--accent");
    const negative = styles.getPropertyValue("--mutation");
    const ink = styles.getPropertyValue("--ink");
    const muted = styles.getPropertyValue("--muted");
    const rule = styles.getPropertyValue("--rule");

    const padLeft = 74;
    const padRight = 52;
    const padY = 22;
    const px = (node) => padLeft + node.x * (width - padLeft - padRight);
    const py = (node) => padY + node.y * (height - padY * 2);
    const radius = Math.min(1, Math.max(0.55, height / 620));

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const wired = new Set();
    for (let i = 0; i < shown; i++) {
      const edge = edges[i];
      wired.add(edge.a);
      wired.add(edge.b);
      const fresh = now - bornAt[i] < HIGHLIGHT_FOR;
      const color = edge.w > 0 ? positive : negative;
      ctx.beginPath();
      ctx.strokeStyle = fresh ? ink : color;
      ctx.globalAlpha = fresh ? 1 : 0.55;
      ctx.lineWidth = fresh ? 2.5 : 0.75 + Math.min(Math.abs(edge.w), 8) * 0.28;
      ctx.shadowColor = fresh ? color : "transparent";
      ctx.shadowBlur = fresh ? 16 : 0;
      ctx.moveTo(px(edge.from), py(edge.from));
      ctx.lineTo(px(edge.to), py(edge.to));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Signals travelling along the connections drawn so far
    if (!reducedMotion) {
      for (let i = 0; i < shown; i++) {
        const edge = edges[i];
        const t = (now / PULSE_PERIOD + edge.phase) % 1;
        const color = edge.w > 0 ? positive : negative;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px(edge.from) + (px(edge.to) - px(edge.from)) * t, py(edge.from) + (py(edge.to) - py(edge.from)) * t, 1.75, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const node of nodes) {
      const isHidden = node.x > 0 && node.x < 1;
      const on = wired.has(node.id);
      if (isHidden && !on) continue;
      ctx.beginPath();
      ctx.fillStyle = on ? positive : rule;
      ctx.shadowColor = positive;
      ctx.shadowBlur = on ? 12 : 0;
      ctx.arc(px(node), py(node), (node.x === 1 ? 8 : isHidden ? 6 : 4.5) * radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    ctx.textBaseline = "middle";
    ctx.font = `11px "JetBrains Mono", monospace`;
    ctx.fillStyle = muted;
    ctx.textAlign = "right";
    for (const group of groups) ctx.fillText(group.name, padLeft - 12, padY + group.y * (height - padY * 2));
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    for (const node of nodes) {
      if (!node.label) continue;
      const angle = ARROW_ANGLES[node.label];
      if (angle === undefined) {
        ctx.fillText(node.label, px(node) + 13, py(node));
        continue;
      }
      ctx.save();
      ctx.translate(px(node) + 20, py(node));
      ctx.rotate(angle);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(7, 0);
      ctx.moveTo(2, -5);
      ctx.lineTo(7, 0);
      ctx.lineTo(2, 5);
      ctx.stroke();
      ctx.restore();
    }

    const hiddenShown = nodes.filter((node) => node.x > 0 && node.x < 1 && wired.has(node.id)).length;
    caption.textContent = `Evolved in my thesis · ${hiddenShown}/${hiddenTotal} hidden nodes · ${shown}/${edges.length} connections · teal + / pink −`;
  }

  function loop(now) {
    if (visible) {
      step(now);
      draw(now);
    }
    requestAnimationFrame(loop);
  }

  new ResizeObserver(() => draw(performance.now())).observe(canvas);

  if (reducedMotion) return;

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
  requestAnimationFrame(loop);
};
