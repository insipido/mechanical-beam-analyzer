const SECTIONS = 120;

function analyzeBeam({ L, E, I, pointLoads, distLoads, supportA, supportB }) {
  if (supportA === supportB) throw new Error("Supports cannot coincide");

  const dx = L / SECTIONS;
  const x = [], V = [], M = [], y = [];

  const reactions = computeReactions(
    L, pointLoads, distLoads, supportA, supportB
  );

  for (let i = 0; i <= SECTIONS; i++) {
    const xi = i * dx;
    let shear = 0;
    let moment = 0;

    if (xi >= supportA) {
      shear += reactions.RA;
      moment += reactions.RA * (xi - supportA);
    }

    if (xi >= supportB) {
      shear += reactions.RB;
      moment += reactions.RB * (xi - supportB);
    }

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

  const ya = interpolate(x, y, supportA);
  const yb = interpolate(x, y, supportB);

  for (let i = 0; i <= SECTIONS; i++) {
    const corr =
      ya + (yb - ya) * ((x[i] - supportA) / (supportB - supportA));
    y[i] -= corr;
  }

  return { reactions, x, V, M, y };
}

function computeReactions(L, P, W, a, b) {
  let total = 0;
  let mA = 0;

  P.forEach(p => {
    total += p.P;
    mA += p.P * (p.x - a);
  });

  W.forEach(d => {
    const wT = d.w * (d.x2 - d.x1);
    const xc = (d.x1 + d.x2) / 2;
    total += wT;
    mA += wT * (xc - a);
  });

  const RB = mA / (b - a);
  return { RA: total - RB, RB };
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
