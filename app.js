const byId = id => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: ${id}`);
  return el;
};

const L = byId("L");
const P = byId("P");
const Px = byId("Px");
const w = byId("w");
const x1 = byId("x1");
const x2 = byId("x2");

const beamCanvas = byId("beam").getContext("2d");
const shearCanvas = byId("shear").getContext("2d");
const momentCanvas = byId("moment").getContext("2d");

let pointLoads = [];
let distLoads = [];

byId("addPointLoad").onclick = () => {
  pointLoads.push({ P: +P.value, x: +Px.value });
};

byId("addDistLoad").onclick = () => {
  distLoads.push({ w: +w.value, x1: +x1.value, x2: +x2.value });
};

byId("analyzeBtn").onclick = () => {
  const result = analyzeBeam({
    L: +L.value,
    pointLoads,
    distLoads
  });

  plot(shearCanvas, result.x, result.V);
  plot(momentCanvas, result.x, result.M);

  byId("output").textContent =
    `RA = ${result.reactions.RA.toFixed(2)}\n` +
    `RB = ${result.reactions.RB.toFixed(2)}\n` +
    `Max |V| = ${Math.max(...result.V.map(v => Math.abs(v))).toFixed(2)}\n` +
    `Max |M| = ${Math.max(...result.M.map(v => Math.abs(v))).toFixed(2)}`;
};

function plot(ctx, x, y) {
  ctx.clearRect(0,0,900,150);
  const max = Math.max(...y.map(v => Math.abs(v))) || 1;

  ctx.beginPath();
  ctx.moveTo(50,75);

  y.forEach((v,i) => {
    const px = 50 + 800 * x[i] / x[x.length-1];
    const py = 75 - 60 * v / max;
    ctx.lineTo(px, py);
  });

  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(50,75);
  ctx.lineTo(850,75);
  ctx.strokeStyle = "#888";
  ctx.stroke();
}
