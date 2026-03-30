const ctxBeam = document.getElementById("beam").getContext("2d");
const ctxShear = document.getElementById("shear").getContext("2d");
const ctxMoment = document.getElementById("moment").getContext("2d");
const ctxDef = document.getElementById("deflection").getContext("2d");

let pointLoads = [];
let distLoads = [];

document.getElementById("addPointLoad").onclick = () => {
  pointLoads.push({
    P: +P.value,
    x: +Px.value
  });
  drawBeam();
};

document.getElementById("addDistLoad").onclick = () => {
  distLoads.push({
    w: +w.value,
    x1: +x1.value,
    x2: +x2.value
  });
  drawBeam();
};

document.getElementById("analyzeBtn").onclick = () => {
  const res = analyzeBeam({
    L: +L.value,
    E: +E.value,
    I: +I.value,
    pointLoads,
    distLoads
  });

  plot(ctxShear, res.x, res.V);
  plot(ctxMoment, res.x, res.M);
  plot(ctxDef, res.x, res.y);

  output.textContent =
    `RA = ${res.reactions.RA.toFixed(2)} N\nRB = ${res.reactions.RB.toFixed(2)} N`;
};

document.getElementById("resetBtn").onclick = () => {
  pointLoads = [];
  distLoads = [];
  [ctxBeam, ctxShear, ctxMoment, ctxDef].forEach(c =>
    c.clearRect(0, 0, 900, 250)
  );
  output.textContent = "";
};

function drawBeam() {
  ctxBeam.clearRect(0, 0, 900, 220);
}

function plot(ctx, x, y) {
  ctx.clearRect(0, 0, 900, 150);
}
