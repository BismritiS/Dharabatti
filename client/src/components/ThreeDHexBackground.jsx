// src/components/ThreeDHexBackground.jsx
const GRID_SIZE = 7; // 7x7 hex cells – adjust if you want more/less

function ThreeDHexBackground() {
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      cells.push({ x, y, key: `${x}-${y}` });
    }
  }

  return (
    <div className="hex3d-wrapper">
      <div className="hex3d-plane">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className="hex3d-cell"
            style={{
              '--x': cell.x,
              '--y': cell.y,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ThreeDHexBackground;