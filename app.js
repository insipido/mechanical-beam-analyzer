let loads = [];
let analysisRunning = false;

const beamCanvas = document.getElementById("beamCanvas");
const beamCtx = beamCanvas.getContext("2d");

// Unit helpers
function toSI_length(v) {
  return unitSystem.value === "Imperial" ? v * 0.3048 : v;
}
function toSI_force(v) {
  return unitSystem.value === "Imperial" ? v * 4.44822 : v * 1000;
}

// Click to add load
beamCanvas.addEventListener("click", e => {
  const rect = beamCanvas.getBoundingClientRect();
  const xPx = e.clientX - rect.left;

  const L = toSI_length(+beamLength.value);
  const pos = ((xPx - 50) / (beamCanvas.width - 100)) * L;

  const forceInput = prompt("Enter load magnitude:");
  if (!forceInput) return;

  loads.push({
    position: Math.max(0, Math.min(L, pos)),
    force: -toSI_force(+forceInput)
  });

  updateLoadList();
  drawBeam();
});

// Draw beam and loads
function drawBeam() {
  beamCtx.clearRect(0, 0, beamCanvas.width, beamCanvas.height);

  const L = toSI_length(+beamLength.value);
  const scale = (beamCanvas.width - 100) / L;
  const y = beamCanvas.height / 2;

  beamCtx.beginPath();
  beamCtx.moveTo(50, y);
  beamCtx.lineTo(50 + L * scale, y);
  beamCtx.stroke();

  loads.forEach(load => {
    const x = 50 + load.position * scale;
    beamCtx.beginPath();
    beamCtx.moveTo(x, y - 50);
    beamCtx.lineTo(x, y);
    beamCtx.stroke();
  });
}

// Load list
function updateLoadList() {
  loadList.innerHTML = "";
  loads.forEach((l, i) => {
    const li = document.createElement("li");
    li.innerHTML = `Load ${i + 1} at ${l.position.toFixed(2)} m 
      <button onclick="removeLoad(${i})">X</button>`;
    loadList.appendChild(li);
  });
}

window.removeLoad = i => {
  loads.splice(i, 1);
  updateLoadList();
  drawBeam();
};

// Plot diagram utility
function plot(canvasId, x, y) {
  const c = document.getElementById(canvasId);
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  const maxY = Math.max(...y.map(Math.abs)) || 1;

  ctx.beginPath();
  y.forEach((v, i) => {
    const px = 40 + (x[i] / x[x.length - 1]) * (c.width - 80);
    const py = c.height / 2 - (v / maxY) * (c.height / 2 - 20);
    ctx.lineTo(px, py);
  });
  ctx.stroke();
}

// Analyze
function analyze() {
  if (!analysisRunning) return;

  const L = toSI_length(+beamLength.value);
  const E = +document.getElementById("E").value;
  const I = +document.getElementById("I").value;

  const res = analyzeBeamMultiple(L, loads, E, I);

  plot("shearCanvas", res.x, res.shear);
  plot("momentCanvas", res.x, res.moment);
  plot("deflectionCanvas", res.x, res.deflection);

  results.innerHTML = `
    Reaction A: ${res.RA.toFixed(1)} N<br>
    Reaction B: ${res.RB.toFixed(1)} N<br>
    Max Moment: ${Math.max(...res.moment).toFixed(1)} N·m
  `;
}

// Buttons
startBtn.onclick = () => {
  analysisRunning = true;
  status.innerText = "Status: Analyzing...";
  drawBeam();
  analyze();
  status.innerText = "Status: Complete";
};

stopBtn.onclick = () => {
  analysisRunning = false;
  status.innerText = "Status: Stopped";
};

resetBtn.onclick = () => {
  loads = [];
  analysisRunning = false;
  updateLoadList();
  drawBeam();
  status.innerText = "Status: Reset";
};
