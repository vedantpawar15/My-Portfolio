import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * MCG-style bowl: concrete tiers + mint seats + mid-level "glass" band + white roof rim
 */
const TIER_CONFIG = [
  { y: 0.95, major: 19.35, minor: 1.08, color: '#5b6570' },
  { y: 2.25, major: 20.75, minor: 1.12, color: '#6d7784' },
  { y: 3.65, major: 22.15, minor: 1.22, color: '#7e8996' },
  { y: 5.05, major: 23.55, minor: 1.28, color: '#909aa8' },
  { y: 6.45, major: 24.95, minor: 1.32, color: '#a2abb8' },
];

const concreteMat = (hex) =>
  new THREE.MeshStandardMaterial({
    color: hex,
    roughness: 0.86,
    metalness: 0.1,
  });

const glassBandMat = new THREE.MeshStandardMaterial({
  color: '#2a4a62',
  metalness: 0.92,
  roughness: 0.12,
  emissive: '#1a3550',
  emissiveIntensity: 0.35,
});

const roofMat = new THREE.MeshStandardMaterial({
  color: '#e8eef2',
  roughness: 0.55,
  metalness: 0.08,
  emissive: '#c5d5e5',
  emissiveIntensity: 0.08,
});

export function StadiumStandTiers() {
  const mats = useMemo(() => TIER_CONFIG.map((t) => concreteMat(t.color)), []);

  return (
    <group>
      {TIER_CONFIG.map((t, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, t.y, 0]}
          castShadow
          receiveShadow
          material={mats[i]}
        >
          <torusGeometry args={[t.major, t.minor, 16, 112]} />
        </mesh>
      ))}

      {/* Corporate / glass band (MCG middle tier read) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.78, 0]} castShadow receiveShadow material={glassBandMat}>
        <torusGeometry args={[21.25, 0.38, 8, 96]} />
      </mesh>

      {/* Cantilever roof rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7.35, 0]} castShadow receiveShadow material={roofMat}>
        <torusGeometry args={[26.2, 0.52, 10, 120]} />
      </mesh>

      {/* Scoreboard slab — far side */}
      <mesh position={[22, 5.8, -6]} castShadow receiveShadow rotation={[0, -0.55, 0]}>
        <boxGeometry args={[0.25, 3.2, 5.5]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.35} metalness={0.2} emissive="#112211" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

/** Mint / grey-green seats (MCG lower bowl read) */
export function StadiumCrowdSilhouette() {
  const mesh = useMemo(() => {
    const n = 2800;
    const geo = new THREE.BoxGeometry(0.19, 0.24, 0.15);
    const mat = new THREE.MeshStandardMaterial({
      color: '#8ecfb0',
      roughness: 0.78,
      metalness: 0.02,
    });
    const m = new THREE.InstancedMesh(geo, mat, n);
    const dummy = new THREE.Object3D();
    let seed = 90210;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < n; i++) {
      const tier = Math.floor(rand() * TIER_CONFIG.length);
      const t = TIER_CONFIG[tier];
      const ang = rand() * Math.PI * 2;
      const radialJ = (rand() - 0.5) * t.minor * 1.35;
      const r = t.major + radialJ;
      const y = t.y + (rand() - 0.5) * t.minor * 0.85 + 0.1;
      dummy.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
      dummy.rotation.y = ang + (rand() - 0.5) * 0.4;
      dummy.scale.setScalar(0.78 + rand() * 0.48);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }, []);

  return <primitive object={mesh} />;
}
