const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const toolSelect = document.getElementById("toolSelect");
const unitSystem = document.getElementById("unitSystem");
const statusSpan = document.getElementById("status");
const output = document.getElementById("output");

let nodes = [];
let beams = [];
let loads = [];

let firstBeamNode = null;

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Beams
  beams.forEach(b => {
    ctx.beginPath();
    ctx.moveTo(b.n1.x, b.n1.y);
    ctx.lineTo(b.n2.x, b.n2.y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
  });

  // Loads
  loads.forEach(l => {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y - 25);
    ctx.lineTo(l.x, l.y);
    ctx.strokeStyle = "red";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(l.x - 5, l.y - 20);
    ctx.lineTo(l.x, l.y - 25);
    ctx.lineTo(l.x + 5, l.y - 20);
    ctx.fillStyle = "red";
    ctx.fill();
  });
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const tool = toolSelect.value;

  if (tool === "node") {
    nodes.push({ x, y });
    statusSpan.textContent = `Node added (${nodes.length})`;
  }

  if (tool === "beam") {
    if (!firstBeamNode && nodes.length > 0) {
      firstBeamNode = nodes[nodes.length - 1];
      statusSpan.textContent = "Select second node for beam";
    } else if (firstBeamNode) {
      beams.push({ n1: firstBeamNode, n2: nodes[nodes.length - 1] });
      firstBeamNode = null;
      statusSpan.textContent = "Beam created";
    }
  }

  if (tool === "load" && beams.length === 1) {
    const beam = beams[0];
    const pos = Math.abs(x - beam.n1.x);
    const value = 10; // N (fixed for V1)

    loads.push({
      x,
      y,
      value,
      position: pos
    });

    statusSpan.textContent = "Point load added";
  }

  redraw();
});

document.getElementById("analyzeBtn").onclick = () => {
  const result = analyzeBeam(nodes, beams, loads);

  if (result.error) {
    output.textContent = result.error;
    return;
  }

  output.textContent =
    `Beam length: ${result.length.toFixed(2)} px\n` +
    `Total load: ${result.totalLoad.toFixed(2)} N\n` +
    `Reaction at A: ${result.reactionA.toFixed(2)} N\n` +
    `Reaction at B: ${result.reactionB.toFixed(2)} N`;

  statusSpan.textContent = "Analysis complete";
};

document.getElementById("resetBtn").onclick = () => {
  nodes = [];
  beams = [];
  loads = [];
  firstBeamNode = null;
  redraw();
  output.textContent = "";
  statusSpan.textContent = "Reset";
};

redraw();
