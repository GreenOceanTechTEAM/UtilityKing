"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const EnergyGridBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 50, 120);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // GRID CONFIG
    const gridSize = 300;
    const segments = 70;

    const geometry = new THREE.PlaneGeometry(gridSize, gridSize, segments, segments);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4fa3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    const grid = new THREE.Mesh(geometry, material);
    grid.rotation.x = -Math.PI / 2.3;
    scene.add(grid);

    // AURORA LIGHT
    const aurora = new THREE.PointLight(0x70c4ff, 2, 600);
    aurora.position.set(0, 120, 40);
    scene.add(aurora);

    // WAVE ANIMATION
    let t = 0;
    const updateWaves = () => {
      t += 0.02;
      const pos = grid.geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        const wave =
          Math.sin((x + t * 8) * 0.12) * 2 +
          Math.cos((y + t * 8) * 0.12) * 2.5;

        pos.setZ(i, wave);
      }

      pos.needsUpdate = true;
    };

    // MOUSE PARALLAX
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
    };
    document.addEventListener("mousemove", handleMouseMove);

    // RESIZE
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // ELECTRIC SPARKS
    type Spark = { light: THREE.PointLight; life: number };
    const sparks: Spark[] = [];
    const addSpark = () => {
      const spark = new THREE.PointLight(0x00eaff, 2, 40);
      spark.position.set(
        (Math.random() - 0.5) * gridSize,
        2,
        (Math.random() - 0.5) * gridSize
      );
      sparks.push({ light: spark, life: 0 });
      scene.add(spark);
    };
    const sparkInterval = setInterval(addSpark, 350);

    const updateSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 0.04;
        s.light.intensity = 2 * (1 - s.life);
        if (s.life >= 1) {
          scene.remove(s.light);
          sparks.splice(i, 1);
        }
      }
    };

    // ANIMATE
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      updateWaves();
      updateSparks();

      camera.position.x += (mouseX * 40 - camera.position.x) * 0.03;
      camera.position.y += (50 - mouseY * 40 - camera.position.y) * 0.03;

      camera.lookAt(grid.position);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(sparkInterval);
      cancelAnimationFrame(animationFrameId);
      if (container) {
          container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-[-2] w-full h-full" />;
};

export default EnergyGridBackground;
