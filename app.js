const ctxBeam = beam.getContext("2d");
const ctxShear = shear.getContext("2d");
const ctxMoment = moment.getContext("2d");
const ctxDef = deflection.getContext("2d");

let supports = [];
let pointLoads = [];
let distLoads = [];

function scaleX(x) {
  return 50 + 800 * x / L.value;
}

addSupport.onclick = () => {
  const x = +supportPos.value;
  if (isNaN(x) || x < 0 || x > +L.value) return alert("Invalid support");

  if (supports.length === 2) return alert("Only two supports allowed");

  supports.push({ x });
  supportPos.value = "";
  drawBeam();
};

addPointLoad.onclick = () => {
  pointLoads.push({ P: +P.value, x: +Px.value });
  drawBeam();
};

addDistLoad.onclick = () => {
  distLoads.push({ w: +w.value, x1: +x1.value, x2: +x2.value });
  drawBeam();
};

analyzeBtn.onclick = () => {
  if (supports.length !== 2) return alert("Add exactly two supports");

  const res = analyzeBeam({
    L: +L.value,
    E: +E.value,
    I: +I.value,
    pointLoads,
    distLoads,
    supportA: supports[0].x,
    supportB: supports[1].x
  });

  plot(ctxShear, res.x, res.V);
  plot(ctxMoment, res.x, res.M);
  plot(ctxDef, res.x, res.y);

  output.textContent =
    `RA = ${res.reactions.RA.toFixed(2)} N\n` +
    `RB = ${res.reactions.RB.toFixed(2)} N`;
};

resetBtn.onclick = () => {
  supports = [];
  pointLoads = [];
  distLoads = [];
  drawBeam();
  [ctxShear, ctxMoment, ctxDef].forEach(c => c.clearRect(0,0,900,150));
  output.textContent = "";
};

function drawBeam() {
  ctxBeam.clearRect(0,0,900,220);

  ctxBeam.beginPath();
  ctxBeam.moveTo(50,110);
  ctxBeam.lineTo(850,110);
  ctxBeam.stroke();

  supports.forEach((s,i) => {
    const px = scaleX(s.x);
    ctxBeam.beginPath();
    ctxBeam.moveTo(px-12,120);
    ctxBeam.lineTo(px+12,120);
    ctxBeam.lineTo(px,140);
    ctxBeam.fillStyle="blue";
    ctxBeam.fill();
    ctxBeam.fillText(`S${i+1}`,px-6,155);
  });

  pointLoads.forEach(p => {
    const px = scaleX(p.x);
    ctxBeam.beginPath();
    ctxBeam.moveTo(px,60);
    ctxBeam.lineTo(px,110);
    ctxBeam.strokeStyle="red";
    ctxBeam.stroke();
  });

  distLoads.forEach(d => {
    ctxBeam.fillStyle="rgba(255,0,0,0.25)";
    ctxBeam.fillRect(scaleX(d.x1),80,scaleX(d.x2)-scaleX(d.x1),30);
  });

  supportsList.innerHTML = supports.map((s,i)=>`Support ${i+1}: ${s.x} m`).join("<br>");
  loadsList.innerHTML =
    pointLoads.map(p=>`P=${p.P} N @ ${p.x} m`).join("<br>") +
    "<br>" +
    distLoads.map(d=>`w=${d.w} N/m [${d.x1}, ${d.x2}]`).join("<br>");
}

function plot(ctx, x, y) {
  ctx.clearRect(0,0,900,150);
  const max = Math.max(...y.map(v=>Math.abs(v)))||1;
  ctx.beginPath();
  y.forEach((v,i)=>ctx.lineTo(scaleX(x[i]),75-60*v/max));
  ctx.stroke();
}

drawBeam();
