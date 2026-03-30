function plotDiagram(canvasId, x, y, label) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 40;
  const maxY = Math.max(...y.map(Math.abs)) || 1;

  ctx.beginPath();
  ctx.moveTo(padding, canvas.height / 2);

  for (let i = 0; i < x.length; i++) {
    const px =
      padding +
      (x[i] / x[x.length - 1]) * (canvas.width - 2 * padding);
    const py =
      canvas.height / 2 -
      (y[i] / maxY) * (canvas.height / 2 - padding);
    ctx.lineTo(px, py);
  }

  ctx.stroke();

  ctx.fillText(label, 10, 20);
}
