const SECTIONS = 120;

function analyzeBeam({ L, E, I, pointLoads, distLoads, supportA, supportB }) {
  if (supportA === supportB) {
    throw new Error("Supports cannot be at the same location");
  }

  const dx = L / SECTIONS;
  const x = [], V = [], M = [], y = [];

  const reactions = computeReactions(
    L,
    pointLoads,
    distLoads,
    supportA,
    supportB
  );

  for (let i = 0; i <= SECTIONS; i++) {
    const xi = i * dx;

    let shear = 0;
    let moment = 0;

    // Reactions
    if (xi >= supportA) shear += reactions.RA;
    if (xi >= supportB) shear += reactions.RB;

    // Moments from reactions
    if (xi >= supportA) moment += reactions.RA * (xi - supportA);
    if (xi >= supportB) moment += reactions.RB * (xi - supportB);

    // Point loads
    pointLoads.forEach(p => {
      if (xi >= p.x) {
        shear -= p.P;
        moment -= p.P * (xi - p.x);
      }
    });

    // Distributed loads
    distLoads.forEach(d => {
      if (xi >= d.x1) {
        const len = Math.min(xi, d.x2) - d.x1;
        if (len > 0) {
          const wRes = d.w * len;
          shear -= wRes;
          moment -= wRes * (xi - (d.x1 + len / 2));
        }
      }
    });

    x.push(xi);
    V.push(shear);
    M.push(moment);
  }

  // Deflection (Euler–Bernoulli)
  y[0] = 0;
  let slope = 0;

  for (let i = 1; i <= SECTIONS; i++) {
    slope += M[i - 1] / (E * I) * dx;
    y[i] = y[i - 1] + slope * dx;
  }

  // Remove rigid-body motion (y(a)=0 and y(b)=0)
  const ya = interpolate(x, y, supportA);
  const yb = interpolate(x, y, supportB);

  for (let i = 0; i <= SECTIONS; i++) {
    const correction =
      ya + (yb - ya) * ((x[i] - supportA) / (supportB - supportA));
    y[i] -= correction;
  }

  return { reactions, x, V, M, y };
}

function computeReactions(L, P, W, a, b) {
  let total = 0;
  let momentA = 0;

  P.forEach(p => {
    total += p.P;
    momentA += p.P * (p.x - a);
  });

  W.forEach(d => {
    const Wt = d.w * (d.x2 - d.x1);
    const xc = (d.x1 + d.x2) / 2;
    total += Wt;
    momentA += Wt * (xc - a);
  });

  const RB = momentA / (b - a);
  const RA = total - RB;

  return { RA, RB };
}

function interpolate(x, y, xi) {
  for (let i = 1; i < x.length; i++) {
    if (x[i] >= xi) {
      const t = (xi - x[i - 1]) / (x[i] - x[i - 1]);
      return y[i - 1] + t * (y[i] - y[i - 1]);
    }
  }
  return 0;
}
