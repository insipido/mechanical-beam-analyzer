export function solveStructure(nodes, elements, loads) {
  // Minimal 2D stiffness solver (Ux, Uy per node)
  const dof = nodes.length * 2;
  let K = Array.from({ length: dof }, () => Array(dof).fill(0));
  let F = Array(dof).fill(0);

  elements.forEach(el => {
    const n1 = nodes[el.n1];
    const n2 = nodes[el.n2];
    const L = Math.hypot(n2.x - n1.x, n2.y - n1.y);
    const c = (n2.x - n1.x) / L;
    const s = (n2.y - n1.y) / L;
    const k = el.E * el.A / L;

    const ke = [
      [ c*c,  c*s, -c*c, -c*s],
      [ c*s,  s*s, -c*s, -s*s],
      [-c*c, -c*s,  c*c,  c*s],
      [-c*s, -s*s,  c*s,  s*s]
    ].map(row => row.map(v => v * k));

    const map = [
      el.n1*2, el.n1*2+1,
      el.n2*2, el.n2*2+1
    ];

    map.forEach((r, i) => {
      map.forEach((c, j) => {
        K[r][c] += ke[i][j];
      });
    });
  });

  loads.forEach(l => {
    F[l.node*2 + (l.dir === "x" ? 0 : 1)] += l.value;
  });

  // Simple fixed supports at node 0
  K[0][0] = K[1][1] = 1;
  F[0] = F[1] = 0;

  // Solve Kd = F (Gaussian elimination)
  let D = gaussianSolve(K, F);
  return D;
}

function gaussianSolve(A, b) {
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let max = i;
    for (let j = i+1; j < n; j++)
      if (Math.abs(A[j][i]) > Math.abs(A[max][i])) max = j;
    [A[i], A[max]] = [A[max], A[i]];
    [b[i], b[max]] = [b[max], b[i]];

    for (let j = i+1; j < n; j++) {
      let f = A[j][i] / A[i][i];
      for (let k = i; k < n; k++) A[j][k] -= f * A[i][k];
      b[j] -= f * b[i];
    }
  }

  let x = Array(n).fill(0);
  for (let i = n-1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i+1; j < n; j++) sum -= A[i][j] * x[j];
    x[i] = sum / A[i][i];
  }
  return x;
}
``
