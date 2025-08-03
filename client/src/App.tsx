import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { HexagonGrid, Title, Footer } from "./components";
import { SmoothLighting } from "./components/SmoothLighting";
import { useMouse, useTheme } from "./hooks";
import "@fontsource/inter";
import "@fontsource/jetbrains-mono";

function App() {
  const mousePosition = useMouse();
  const { theme, toggleTheme } = useTheme();

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on footer
    const target = e.target as HTMLElement;
    if (target.closest(".footer")) return;

    toggleTheme();
  };

  return (
    <div
      onClick={handleBackgroundClick}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "background-color 0.75s ease",
      }}
    >
      {/* 3D Canvas for hexagon grid */}
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{ 
          background: theme === "dark" ? "#000000" : "#ffffff",
          transition: "background-color 0.75s ease"
        }}
      >
        <Suspense fallback={null}>
          {/* Smooth lighting transitions */}
          <SmoothLighting theme={theme} />

          {/* Main hexagon grid */}
          <HexagonGrid mousePosition={mousePosition} theme={theme} />
        </Suspense>
      </Canvas>

      {/* Overlay title */}
      <Title theme={theme} />

      {/* Footer */}
      <Footer theme={theme} />
    </div>
  );
}

export default App;
