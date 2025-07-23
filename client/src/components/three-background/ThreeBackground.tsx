import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("vite-ui-theme") === "dark"
  );

  // Listen for theme changes in localStorage and custom event
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(localStorage.getItem("vite-ui-theme") === "dark");
    };
    window.addEventListener("storage", updateTheme);
    window.addEventListener("vite-ui-theme-change", updateTheme);
    return () => {
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("vite-ui-theme-change", updateTheme);
    };
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? "#101014" : "#fefce8");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      color: isDarkMode ? "#f59e10" : "#facc15", // orange for dark, yellow for light
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount?.removeChild(renderer.domElement);
    };
  }, [isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ThreeBackground;
