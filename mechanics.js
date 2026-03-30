function analyzeBeam({ L, E, I, pointLoads, distLoads }) {
  const n = 40;
  const dx = L / n;

  let x = [], V = [], M = [];
  let reactions = computeReactions(L, pointLoads, distLoads);

  for (let i = 0; i <= n; i++) {
    let xi = i * dx;
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
        const w = d.w * len;
        shear -= w;
        moment -= w * (xi - (d.x1 + len / 2));
      }
    });

    x.push(xi);
    V.push(shear);
    M.push(moment);
  }

  return { reactions, x, V, M };
}

function computeReactions(L, P, W) {
  let total = 0, moment = 0;

  P.forEach(p => {
    total += p.P;
    moment += p.P * p.x;
  });

  W.forEach(d => {
    const w = d.w * (d.x2 - d.x1);
    const xc = (d.x1 + d.x2) / 2;
    total += w;
    moment += w * xc;
  });

  const RB = moment / L;
  return { RA: total - RB, RB };
}
``
