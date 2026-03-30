const beamCanvas = document.getElementById("beam");
const shearCanvas = document.getElementById("shear");
const momentCanvas = document.getElementById("moment");
const ctxB = beamCanvas.getContext("2d");
const ctxS = shearCanvas.getContext("2d");
const ctxM = momentCanvas.getContext("2d");

let pointLoads = [];
let distLoads = [];

beamCanvas.addEventListener("click", e => {
  const rect = beamCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / beamCanvas.width *
            Number(L.value);

  if (tool.value === "point") {
    pointLoads.push({ x, P: 10 });
  } else {
    distLoads.push({ x1: x, x2: x + 1, w: 5 });
  }

  drawBeam();
});

function drawBeam() {
  ctxB.clearRect(0, 0, beamCanvas.width, beamCanvas.height);
  ctxB.beginPath();
  ctxB.moveTo(50, 100);
  ctxB.lineTo(850, 100);
  ctxB.stroke();

  pointLoads.forEach(p => {
    let px = 50 + 800 * p.x / L.value;
    ctxB.beginPath();
    ctxB.moveTo(px, 60);
    ctxB.lineTo(px, 100);
    ctxB.stroke();
  });
}

analyze.onclick = () => {
  const res = analyzeBeam({
    L: +L.value,
    E: +E.value,
    I: +I.value,
    pointLoads,
    distLoads
  });

  plot(ctxS, res.x, res.V);
  plot(ctxM, res.x, res.M);
  status.textContent = "Solved";
};

function plot(ctx, x, y) {
  ctx.clearRect(0, 0, 900, 150);
  const max = Math.max(...y.map(Math.abs)) || 1;

  ctx.beginPath();
  y.forEach((v, i) => {
    const px = 50 + 800 * x[i] / x.at(-1);
    const py = 75 - 60 * v / max;
    ctx.lineTo(px, py);
  });
  ctx.stroke();
}

reset.onclick = () => {
  pointLoads = [];
  distLoads = [];
  drawBeam();
  ctxS.clearRect(0,0,900,150);
  ctxM.clearRect(0,0,900,150);
};
