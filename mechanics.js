function analyze() {
  const L = Number(document.getElementById("beamLength").value);
  const P = Number(document.getElementById("forceValue").value);
  const a = Number(document.getElementById("forcePosition").value);
  const E = Number(document.getElementById("E").value);
  const I = Number(document.getElementById("I").value);

  drawBeam(L, P, a);

  const result = analyzeBeamFull(L, P, a, E, I);

  plotDiagram("shearCanvas", result.x, result.shear, "Shear (kN)");
  plotDiagram("momentCanvas", result.x, result.moment, "Moment (kN·m)");
  plotDiagram(
    "deflectionCanvas",
    result.x,
    result.deflection,
    "Deflection (m)"
  );

  document.getElementById("results").innerHTML = `
    Reaction A: ${result.RA.toFixed(2)} kN<br>
    Reaction B: ${result.RB.toFixed(2)} kN<br>
    Max Moment: ${Math.max(...result.moment).toFixed(2)} kN·m<br>
    Max Deflection: ${Math.max(
      ...result.deflection.map(Math.abs)
    ).toExponential(3)} m
  `;
}
``
