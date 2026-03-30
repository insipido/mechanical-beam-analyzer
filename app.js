import { solveStructure } from "./solver.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let nodes = [];
let elements = [];
let loads = [];

canvas.addEventListener("click", e => {
  const tool = toolSelect.value;
  const x = e.offsetX;
  const y = e.offsetY;

  if (tool === "node") {
    nodes.push({ x, y });
  }
});

solveBtn.onclick = () => {
  status.textContent = "Solving...";
  const disp = solveStructure(nodes, elements, loads);
  output.textContent = JSON.stringify(disp, null, 2);
  status.textContent = "Solved";
};

resetBtn.onclick = () => {
  nodes = [];
  elements = [];
  loads = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
