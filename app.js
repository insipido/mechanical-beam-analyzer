const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const toolSelect = document.getElementById("toolSelect");
const statusSpan = document.getElementById("status");
const output = document.getElementById("output");

const nodes = [];
const loads = [];

// Draw everything
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw loads
  loads.forEach(l => {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y - 30);
    ctx.lineTo(l.x, l.y);
    ctx.stroke();
  });
}

// Canvas interaction
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const tool = toolSelect.value;

  if (tool === "node") {
    nodes.push({ x, y });
    statusSpan.textContent = `Node added (${nodes.length})`;
  }

  if (tool === "pointLoad") {
    loads.push({ x, y });
    statusSpan.textContent = `Point load added (${loads.length})`;
  }

  redraw();
});

// Solve (placeholder but reachable)
document.getElementById("solveBtn").onclick = () => {
  output.textContent =
    `Nodes: ${nodes.length}\nPoint Loads: ${loads.length}\n\n(Solver will be attached here)`;
  statusSpan.textContent = "Solved (geometry only)";
};

// Reset
document.getElementById("resetBtn").onclick = () => {
  nodes.length = 0;
  loads.length = 0;
  redraw();
  output.textContent = "";
  statusSpan.textContent = "Reset";
};
``
