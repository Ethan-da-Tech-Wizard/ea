// ==============================================================================
// Program: label-layout.mjs
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 19, 2026
// Purpose: Vector label geometry and layout calculation utility computing visual bounds and coordinate offsets for interactive canvas nodes.
// ==============================================================================
// Conservative text bounds for the board's 16px connection labels.
/**
 * @param {{label: string, labelX: number, labelY: number}} edge - arrow with its label centre.
 * @returns {{x: number, y: number, w: number, h: number}} rectangle (board units) the label occupies.
 *   Width is estimated per character (16 for wide glyphs M W @ #, 5 for narrow ones, 7 for t f r, 11
 *   otherwise) plus 12 padding, deliberately a little generous so labels are not cut off by the
 *   renderer; height is a fixed 32 and y is 16 above the centre.
 */
export function labelBounds(edge) {
  const width = [...edge.label].reduce((sum, c) => sum + (/[MW@#mw]/.test(c) ? 16 : /[il .,:;!'|]/.test(c) ? 5 : /[tfr]/.test(c) ? 7 : 11), 12);
  return { x: edge.labelX - width / 2, y: edge.labelY - 16, w: width, h: 32 };
}

/**
 * @param {{x: number, y: number, w: number, h: number}} a - first rectangle.
 * @param {{x: number, y: number, w: number, h: number}} b - second rectangle.
 * @param {number} [padding=4] - extra clearance required between the rectangles.
 * @returns {boolean} true if they overlap or are closer than `padding` (standard axis-aligned test).
 */
export function intersects(a, b, padding = 4) {
  return a.x < b.x + b.w + padding && a.x + a.w + padding > b.x
    && a.y < b.y + b.h + padding && a.y + a.h + padding > b.y;
}

// Educational note: Calculates optimal bounding box placements along connector arcs
/**
 * Moves every labelled arrow's label to a position on its path that overlaps no shape and no earlier label.
 * Mutates `view.arrows[*].labelX/labelY` in place.
 *
 * @param {{id: string, shapes: object[], arrows: object[]}} view - one generated board view.
 * @returns {void}
 * @throws {Error} if some label has no clear position anywhere along its arrow.
 */
export function placeConnectionLabels(view) {
  const occupied = view.shapes.map(s => ({ x: s.px, y: s.py, w: s.pw, h: s.ph }));
  const byId = new Map(view.shapes.map(s => [s.shapeId, s]));
  const center = id => {
    const s = byId.get(id);
    return { x: s.px + s.pw / 2, y: s.py + s.ph / 2 };
  };
  // `occupied` starts with every shape rectangle and grows as labels are placed, so later labels avoid them.
  // Place wide labels first; short yes/no labels can fit smaller gaps.
  for (const edge of view.arrows.filter(a => a.label).sort((a, b) => b.label.length - a.label.length)) {
    // The arrow's polyline: source centre, any routed bend points, target centre.
    const points = [center(edge.fromId), ...(edge.points || []), center(edge.toId)];
    // Candidate positions, best first: the router's suggested spot, then points along each segment,
    // ordered by distance from the segment midpoint (0.5), sampled about every 12 units.
    const candidates = [];
    if (Number.isFinite(edge.labelX) && Number.isFinite(edge.labelY)) candidates.push({ x: edge.labelX, y: edge.labelY });
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 12));
      const fractions = [0.5, ...Array.from({ length: steps - 1 }, (_, j) => (j + 1) / steps)];
      fractions.sort((x, y) => Math.abs(x - 0.5) - Math.abs(y - 0.5));
      for (const t of fractions) candidates.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
    // First candidate whose label box is clear of everything placed so far.
    const candidate = candidates.find(p => !occupied.some(rect => intersects(labelBounds({ ...edge, labelX: p.x, labelY: p.y }), rect)));
    if (!candidate) throw new Error(`No clear label position: ${view.id} ${edge.fromId}->${edge.toId} ${edge.label}`);
    edge.labelX = candidate.x;
    edge.labelY = candidate.y;
    occupied.push(labelBounds(edge));
  }
}
