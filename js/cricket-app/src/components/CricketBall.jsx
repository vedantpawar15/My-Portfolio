import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

function quadBezier(a, b, c, t) {
  const u = 1 - t;
  return new THREE.Vector3(
    u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    u * u * a.y + 2 * u * t * b.y + t * t * c.y,
    u * u * a.z + 2 * u * t * b.z + t * t * c.z
  );
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CricketBall() {
  const meshRef = useRef(null);
  const progress = useRef(0);
  const finished = useRef(false);
  const { bowling, endBowling, triggerStumpImpact } = usePortfolio();

  const BALL_R = 0.52;

  const p0 = useMemo(() => new THREE.Vector3(4.4, 0.55 + BALL_R * 0.02, 5.9), []);
  const p1 = useMemo(() => new THREE.Vector3(-0.35, 4.15, 0.35), []);
  const p2 = useMemo(() => new THREE.Vector3(0, BALL_R + 0.06, -4.38), []);

  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b01810';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 4;
    for (let k = 0; k < 2; k++) {
      ctx.beginPath();
      const off = k * 36 - 18;
      for (let x = 0; x <= 512; x += 3) {
        ctx.lineTo(x, 256 + Math.sin(x * 0.045) * 38 + off);
      }
      ctx.stroke();
    }
    const g = ctx.createRadialGradient(170, 160, 8, 170, 160, 200);
    g.addColorStop(0, 'rgba(255,220,200,0.45)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    if (bowling) {
      progress.current = 0;
      finished.current = false;
    }
  }, [bowling]);

  useFrame((state, dt) => {
    const m = meshRef.current;
    if (!m) return;

    if (!bowling) {
      const t = state.clock.elapsedTime;
      m.position.set(Math.sin(t * 0.62) * 3.15, 2.15 + Math.sin(t * 1.35) * 0.42, Math.cos(t * 0.62) * 3.15);
      m.rotation.x += 0.026;
      m.rotation.z += 0.013;
      return;
    }

    progress.current += dt / 1.14;
    const raw = Math.min(1, progress.current);
    const eased = easeInOutCubic(raw);
    m.position.copy(quadBezier(p0, p1, p2, eased));
    m.rotation.x += 0.18;
    m.rotation.z += 0.11;

    if (raw >= 0.86) triggerStumpImpact();

    if (raw >= 1 && !finished.current) {
      finished.current = true;
      progress.current = 0;
      endBowling();
    }
  });

  return (
    <mesh ref={meshRef} castShadow name="ball">
      <sphereGeometry args={[BALL_R, 48, 48]} />
      <meshStandardMaterial map={texture} roughness={0.28} metalness={0.12} envMapIntensity={1.1} />
    </mesh>
  );
}
