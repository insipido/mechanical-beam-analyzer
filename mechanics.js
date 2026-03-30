function analyzeBeamFull(L, P, a, E, I, points = 120) {
  const RA = P * (L - a) / L;
  const RB = P * a / L;

  let x = [];
  let shear = [];
  let moment = [];
  let deflection = [];

  for (let i = 0; i <= points; i++) {
    let xi = (L * i) / points;
    x.push(xi);

    let V = xi < a ? RA : RA - P;
    shear.push(V);

    let M = xi < a ? RA * xi : RA * xi - P * (xi - a);
    moment.push(M);

    let y;
    if (xi <= a) {
      y =
        (P * xi * (L - a) * (L * L - (L - a) ** 2 - xi ** 2)) /
        (6 * E * I * L);
    } else {
      y =
        (P * a * (L - xi) * (L * L - a ** 2 - (L - xi) ** 2)) /
        (6 * E * I * L);
    }
    deflection.push(y);
  }

  return { RA, RB, x, shear, moment, deflection };
}
