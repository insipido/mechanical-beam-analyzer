const SECTIONS = 120;

function analyzeBeam({ L, E, I, pointLoads, distLoads }) {
  const dx = L / SECTIONS;
  const x = [], V = [], M = [], y = [];

  const reactions = computeReactions(L, pointLoads, distLoads);

  for (let i = 0; i <= SECTIONS; i++) {
    const xi = i * dx;
    let shear = reactions.RA;
    let moment = reactions.RA * xi;

    pointLoads.forEach(p => {
      if (xi >= p.x) {
        shear -= p.P;
        moment -= p.P * (xi - p.x);
      }
    });

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

  y[0] = 0;
  let slope = 0;
  for (let i = 1; i <= SECTIONS; i++) {
    slope += M[i - 1] / (E * I) * dx;
    y[i] = y[i - 1] + slope * dx;
  }

  const c = y[SECTIONS] / L;
  for (let i = 0; i <= SECTIONS; i++) y[i] -= c * x[i];

  return { reactions, x, V, M, y };
}

function computeReactions(L, P, W) {
  let total = 0, moment = 0;

  P.forEach(p => { total += p.P; moment += p.P * p.x; });
  W.forEach(d => {
    const wT = d.w * (d.x2 - d.x1);
    const xc = (d.x1 + d.x2) / 2;
    total += wT;
    moment += wT * xc;
  });

  const RB = moment / L;
  return { RA: total - RB, RB };
}
