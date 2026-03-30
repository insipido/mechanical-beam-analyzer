const byId = id => document.getElementById(id);

const ctxBeam = byId("beam").getContext("2d");
const ctxShear = byId("shear").getContext("2d");
const ctxMoment = byId("moment").getContext("2d");
const ctxDef = byId("deflection").getContext("2d");

let pointLoads = [];
let distLoads = [];

byId("addPointLoad").onclick = () => {
  const P = +byId("P").value;
  const x = +byId("Px").value;
  if (P <= 0 || x < 0 || x > +byId("L").value) return alert("Invalid point load");
  pointLoads.push({ P, x });
  redrawBeam();
};

byId("addDistLoad").onclick = () => {
  const w = +byId("w").value;
  const x1 = +byId("x1").value;
  const x2 = +byId("x2").value;
  if (w === 0 || x1 < 0 || x2 <= x1) return alert("Invalid distributed load");
  distLoads.push({ w, x1, x2 });
  redrawBeam();
};

byId("analyzeBtn").onclick = () => {
  const res = analyzeBeam({
    L: +byId("L").value,
    E: +byId("E").value,
    I: +byId("I").value,
    pointLoads,
    distLoads
  });

  plot(ctxShear, res.x, res.V);
  plot(ctxMoment, res.x, res.M);
  plot(ctxDef, res.x, res.y);

  byId("output").textContent =
    `RA = ${res.reactions.RA.toFixed(2)} N\nRB = ${res.reactions.RB.toFixed(2)} N`;
};

byId("resetBtn").onclick = () => {
  pointLoads = [];
  distLoads = [];
  [ctxBeam, ctxShear, ctxMoment, ctxDef].forEach(c => c.clearRect(0,0,900,250));
  byId("output").textContent = "";
};

function redrawBeam() {
  ctxBeam.clearRect(0,0,900,220);
}
function plot(ctx, x, y) {
  ctx.clearRect(0,0,900,150);
}
