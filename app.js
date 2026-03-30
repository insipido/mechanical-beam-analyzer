let analysisRunning = false;

const beamCanvas = document.getElementById("canvas");
const beamCtx = beamCanvas.getContext("2d");

const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");

// Image upload preview
imageUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
  };
  img.src = URL.createObjectURL(file);
});

function drawBeam(L, P, a) {
  beamCtx.clearRect(0, 0, beamCanvas.width, beamCanvas.height);

  const scale = (beamCanvas.width - 100) / L;
  const y = beamCanvas.height / 2;

  beamCtx.beginPath();
  beamCtx.moveTo(50, y);
  beamCtx.lineTo(50 + L * scale, y);
  beamCtx.stroke();

  beamCtx.fillRect(45, y - 5, 10, 10);
  beamCtx.fillRect(45 + L * scale, y - 5, 10, 10);

  const fx = 50 + a * scale;
  beamCtx.beginPath();
  beamCtx.moveTo(fx, y - 60);
  beamCtx.lineTo(fx, y);
  beamCtx.stroke();
}

function plotDiagram(canvasId, x, y, label) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 40;
  const maxY = Math.max(...y.map(Math.abs)) || 1;

  ctx.beginPath();
  ctx.moveTo(padding, canvas.height / 2);

  for (let i = 0; i < x.length; i++) {
    const px = padding + (x[i] / x[x.length - 1]) * (canvas.width - 2 * padding);
    const py = canvas.height / 2 - (y[i] / maxY) * (canvas.height / 2 - padding);
    ctx.lineTo(px, py);
  }

  ctx.stroke();
  ctx.fillText(label, 10, 20);
}

function analyze() {
  if (!analysisRunning) return;

  const L = +beamLength.value;
  const P = +forceValue.value;
  const a = +forcePosition.value;
  const E = +document.getElementById("E").value;
  const I = +document.getElementById("I").value;

  drawBeam(L, P, a);

  const result = analyzeBeamFull(L, P, a, E, I);

  plotDiagram("shearCanvas", result.x, result.shear, "Shear (kN)");
  plotDiagram("momentCanvas", result.x, result.moment, "Moment (kN·m)");
  plotDiagram("deflectionCanvas", result.x, result.deflection, "Deflection (m)");

  results.innerHTML = `
    Reaction A: ${result.RA.toFixed(2)} kN<br>
    Reaction B: ${result.RB.toFixed(2)} kN<br>
    Max Moment: ${Math.max(...result.moment).toFixed(2)} kN·m<br>
    Max Deflection: ${Math.max(...result.deflection.map(Math.abs)).toExponential(2)} m
  `;
}

startBtn.onclick = () => {
  analysisRunning = true;
  status.innerText = "Status: Analyzing...";
  analyze();
  status.innerText = "Status: Complete";
};

stopBtn.onclick = () => {
  analysisRunning = false;
  status.innerText = "Status: Stopped";
};

resetBtn.onclick = () => {
  analysisRunning = false;
  status.innerText = "Status: Reset";

  [beamCanvas, imageCanvas, shearCanvas, momentCanvas, deflectionCanvas]
    .forEach(c => c.getContext("2d").clearRect(0, 0, c.width, c.height));

  results.innerHTML = "";
};

drawBeam(6, 10, 3);
``
