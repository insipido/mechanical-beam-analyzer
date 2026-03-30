function analyzeBeamMultiple(L, loads, E, I, points = 150) {
  let RA = 0;
  let RB = 0;

  loads.forEach(load => {
    RA += load.force * (L - load.position) / L;
    RB += load.force * load.position / L;
  });

  let x = [], shear = [], moment = [], deflection = [];

  for (let i = 0; i <= points; i++) {
    let xi = (L * i) / points;
    x.push(xi);

    let V = RA;
    let M = RA * xi;
    let y = 0;

    loads.forEach(load => {
      if (xi >= load.position) {
        V -= load.force;
        M -= load.force * (xi - load.position);
      }
      if (xi >= load.position) {
        y +=
          load.force *
          (xi - load.position) *
          (L - xi) *
          (L - load.position) /
          (6 * E * I * L);
      }
    });

    shear.push(V);
    moment.push(M);
    deflection.push(y);
  }

  return { RA, RB, x, shear, moment, deflection };
}
``
