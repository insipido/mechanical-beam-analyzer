/**
 * Euler–Bernoulli beam statics (shear & moment only)
 * Deflection uses E and I but is intentionally not faked here.
 */

function analyzeBeam({ L, pointLoads, distLoads, sections = 80 }) {
  if (L <= 0) throw new Error("Beam length must be positive.");

  const dx = L / sections;
  const x = [];
  const V = [];
  const M = [];

  const reactions = computeReactions(L, pointLoads, distLoads);

  for (let i = 0; i <= sections; i++) {
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
      if (xi > d.x1) {
        const length = Math.min(xi, d.x2) - d.x1;
        if (length > 0) {
          const wRes = d.w * length;
          shear -= wRes;
          moment -= wRes * (xi - (d.x1 + length / 2));
        }
      }
    });

    x.push(xi);
    V.push(shear);
    M.push(moment);
  }

  return { reactions, x, V, M };
}

function computeReactions(L, P, W) {
  let total = 0;
  let moment = 0;

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
