const ctxBeam = beam.getContext("2d");
const ctxShear = shear.getContext("2d");
const ctxMoment = moment.getContext("2d");
const ctxDef = deflection.getContext("2d");

let pointLoads = [];
let distLoads = [];

function scaleX(x) {
  return 50 + 800 * x / L.value;
}


function drawBeam() {
  ctxBeam.clearRect(0, 0, 900, 220);

  // Beam
  ctxBeam.beginPath();
  ctxBeam.moveTo(50, 110);
  ctxBeam.lineTo(850, 110);
  ctxBeam.stroke();

  // Supports
  drawSupport(supportA.value, "blue");
  drawSupport(supportB.value, "blue");

  // Point loads
  pointLoads.forEach(p => {
    const px = scaleX(p.x);
    ctxBeam.beginPath();
    ctxBeam.moveTo(px, 60);
    ctxBeam.lineTo(px, 110);
    ctxBeam.strokeStyle = "red";
    ctxBeam.stroke();
  });

  // Distributed loads
  distLoads.forEach(d => {
    const x1 = scaleX(d.x1);
    const x2 = scaleX(d.x2);
    ctxBeam.fillStyle = "rgba(255,0,0,0.2)";
    ctxBeam.fillRect(x1, 80, x2 - x1, 30);
  });
}

function drawSupport(x, color) {
  const px = scaleX(+x);
  ctxBeam.beginPath();
  ctxBeam.moveTo(px - 10, 120);
  ctxBeam.lineTo(px + 10, 120);
  ctxBeam.lineTo(px, 140);
  ctxBeam.closePath();
  ctxBeam.fillStyle = color;
  ctxBeam.fill();
}


function updateLoadList() {
  loadsList.innerHTML =
    pointLoads.map((p,i)=>`P${i+1}: ${p.P}N @ ${p.x}m`).join("<br>") +
    "<br>" +
    distLoads.map((d,i)=>`w${i+1}: ${d.w}N/m [${d.x1}, ${d.x2}]`).join("<br>");
}

addPointLoad.onclick = () => {
  pointLoads.push({ P: +P.value, x: +Px.value });
  drawBeam();
};

addDistLoad.onclick = () => {
  distLoads.push({ w: +w.value, x1: +x1.value, x2: +x2.value });
  drawBeam();
};

analyzeBtn.onclick = () => {
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

  output.textContent = `RA = ${res.reactions.RA.toFixed(2)} N\nRB = ${res.reactions.RB.toFixed(2)} N`;
};

resetBtn.onclick = () => {
  pointLoads = [];
  distLoads = [];
  drawBeam();
  [ctxShear, ctxMoment, ctxDef].forEach(c => c.clearRect(0,0,900,150));
  output.textContent = "";
};

function plot(ctx, x, y) {
  ctx.clearRect(0,0,900,150);
  const max = Math.max(...y.map(v => Math.abs(v))) || 1;
  ctx.beginPath();
  y.forEach((v,i)=>ctx.lineTo(scaleX(x[i]),75 - 60*v/max));
  ctx.stroke();
}

drawBeam();
