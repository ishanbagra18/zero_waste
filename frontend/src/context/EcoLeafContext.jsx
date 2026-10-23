import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const EcoLeafContext = createContext({
  leavesEnabled: false,
  toggleLeaves: () => {},
  setLeavesEnabled: () => {},
});

export const useEcoLeaf = () => useContext(EcoLeafContext);

/* -------------------------------------------------------------------------- */
/*                           LEAF ANIMATION CANVAS                            */
/* -------------------------------------------------------------------------- */

const LeafAnimationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const leafColors = [
      { fill: "#10b981", stroke: "#047857" }, // emerald-500
      { fill: "#34d399", stroke: "#059669" }, // emerald-400
      { fill: "#22c55e", stroke: "#15803d" }, // green-500
      { fill: "#4ade80", stroke: "#16a34a" }, // green-400
      { fill: "#059669", stroke: "#065f46" }, // emerald-600
    ];

    const leavesCount = 42;
    const leaves = Array.from({ length: leavesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height + 200) - 200,
      size: 13 + Math.random() * 14,
      speedY: 1.1 + Math.random() * 1.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.035,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.018 + Math.random() * 0.02,
      swayWidth: 20 + Math.random() * 32,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      flip: Math.random() * Math.PI,
      flipSpeed: 0.025 + Math.random() * 0.025,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      leaves.forEach((leaf) => {
        leaf.y += leaf.speedY;
        leaf.sway += leaf.swaySpeed;
        leaf.rotation += leaf.rotationSpeed;
        leaf.flip += leaf.flipSpeed;

        const currentX = leaf.x + Math.sin(leaf.sway) * leaf.swayWidth;
        const scaleX = Math.cos(leaf.flip);

        ctx.save();
        ctx.translate(currentX, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.scale(scaleX, 1);

        // Draw curved eco leaf body
        ctx.fillStyle = leaf.color.fill;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size);
        ctx.bezierCurveTo(
          leaf.size * 0.75,
          -leaf.size * 0.5,
          leaf.size * 0.75,
          leaf.size * 0.5,
          0,
          leaf.size
        );
        ctx.bezierCurveTo(
          -leaf.size * 0.75,
          leaf.size * 0.5,
          -leaf.size * 0.75,
          -leaf.size * 0.5,
          0,
          -leaf.size
        );
        ctx.fill();

        // Midrib stem line
        ctx.strokeStyle = leaf.color.stroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size * 0.85);
        ctx.lineTo(0, leaf.size * 0.85);
        ctx.stroke();

        ctx.restore();

        // Reset if off-screen at bottom
        if (leaf.y > height + 40) {
          leaf.y = -30;
          leaf.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */

export const EcoLeafProvider = ({ children }) => {
  const [leavesEnabled, setLeavesEnabled] = useState(false);

  const toggleLeaves = () => {
    setLeavesEnabled((prev) => !prev);
  };

  return (
    <EcoLeafContext.Provider value={{ leavesEnabled, toggleLeaves, setLeavesEnabled }}>
      {leavesEnabled && <LeafAnimationCanvas />}
      {children}
    </EcoLeafContext.Provider>
  );
};
