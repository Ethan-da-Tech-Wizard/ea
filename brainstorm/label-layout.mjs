// Conservative text bounds for the board's 16px connection labels.
export function labelBounds(edge) {
  const width = [...edge.label].reduce((sum, c) => sum + (/[MW@#mw]/.test(c) ? 16 : /[il .,:;!'|]/.test(c) ? 5 : /[tfr]/.test(c) ? 7 : 11), 12);
  return { x: edge.labelX - width / 2, y: edge.labelY - 16, w: width, h: 32 };
}

export function intersects(a, b, padding = 4) {
  return a.x < b.x + b.w + padding && a.x + a.w + padding > b.x
    && a.y < b.y + b.h + padding && a.y + a.h + padding > b.y;
}

export function placeConnectionLabels(view) {
  const occupied = view.shapes.map(s => ({ x: s.px, y: s.py, w: s.pw, h: s.ph }));
  const byId = new Map(view.shapes.map(s => [s.shapeId, s]));
  const center = id => {
    const s = byId.get(id);
    return { x: s.px + s.pw / 2, y: s.py + s.ph / 2 };
  };
  // Place wide labels first; short yes/no labels can fit smaller gaps.
  for (const edge of view.arrows.filter(a => a.label).sort((a, b) => b.label.length - a.label.length)) {
    const points = [center(edge.fromId), ...(edge.points || []), center(edge.toId)];
    const candidates = [];
    if (Number.isFinite(edge.labelX) && Number.isFinite(edge.labelY)) candidates.push({ x: edge.labelX, y: edge.labelY });
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 12));
      const fractions = [0.5, ...Array.from({ length: steps - 1 }, (_, j) => (j + 1) / steps)];
      fractions.sort((x, y) => Math.abs(x - 0.5) - Math.abs(y - 0.5));
      for (const t of fractions) candidates.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
    const candidate = candidates.find(p => !occupied.some(rect => intersects(labelBounds({ ...edge, labelX: p.x, labelY: p.y }), rect)));
    if (!candidate) throw new Error(`No clear label position: ${view.id} ${edge.fromId}->${edge.toId} ${edge.label}`);
    edge.labelX = candidate.x;
    edge.labelY = candidate.y;
    occupied.push(labelBounds(edge));
  }
}
