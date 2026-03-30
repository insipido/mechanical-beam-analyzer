/*
  Determinate simply supported beam solver
  Assumes:
  - horizontal beam
  - supports at first and last node
  - vertical point loads only
*/

function analyzeBeam(nodes, beams, loads) {
  if (nodes.length < 2 || beams.length !== 1) {
    return { error: "Exactly one beam and two nodes required." };
  }

  const x0 = nodes[0].x;
  const x1 = nodes[1].x;
  const L = Math.abs(x1 - x0);

  let totalLoad = 0;
  let momentAboutA = 0;

  loads.forEach(load => {
    totalLoad += load.value;
    momentAboutA += load.value * load.position;
  });

  const RB = momentAboutA / L;
  const RA = totalLoad - RB;

  return {
    length: L,
    reactionA: RA,
    reactionB: RB,
    totalLoad: totalLoad
  };
}
