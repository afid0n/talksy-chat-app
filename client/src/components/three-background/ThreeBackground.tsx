import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const getCurrentTheme = () =>
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    let isDark = getCurrentTheme();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? "#101014" : "#fefce8");

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
      mount.innerHTML = ""; // clear old canvas
      mount.appendChild(renderer.domElement);
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      color: isDark ? "#f59e10" : "#facc15",
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

    const handleThemeChange = () => {
      const nowDark = getCurrentTheme();
      if (nowDark !== isDark) {
        isDark = nowDark;
        scene.background = new THREE.Color(isDark ? "#101014" : "#fefce8");
        material.color.set(isDark ? "#f59e10" : "#facc15");
      }
    };

    window.addEventListener("resize", handleResize);
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      mount?.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ThreeBackground;
