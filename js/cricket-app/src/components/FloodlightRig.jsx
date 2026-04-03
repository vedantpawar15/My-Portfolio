import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const POLE_MAT = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.62, metalness: 0.52 });
const HEAD_MAT = new THREE.MeshStandardMaterial({
  color: '#fffef8',
  emissive: '#ffe8a8',
  emissiveIntensity: 2.6,
  roughness: 0.12,
  metalness: 0.4,
});
const LATTICE_MAT = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.45, metalness: 0.65 });

/** MCG-style lattice mast + lamp head (visible in reference frames) */
function LatticeFloodTower({ x, z, targetRef }) {
  const lightRef = useRef(null);

  useLayoutEffect(() => {
    const L = lightRef.current;
    const T = targetRef?.current;
    if (L && T) {
      L.target = T;
      L.target.updateMatrixWorld();
    }
  }, [targetRef]);

  const rungs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 9; i++) {
      const y = 1.2 + i * 1.35;
      arr.push(
        <mesh key={`r-${i}`} position={[x, y, z]} material={LATTICE_MAT}>
          <boxGeometry args={[2.8, 0.07, 0.07]} />
        </mesh>,
        <mesh key={`r2-${i}`} position={[x, y, z]} material={LATTICE_MAT}>
          <boxGeometry args={[0.07, 0.07, 2.8]} />
        </mesh>
      );
    }
    return arr;
  }, [x, z]);

  return (
    <group>
      <mesh position={[x, 6.5, z]} castShadow material={LATTICE_MAT}>
        <boxGeometry args={[0.22, 13, 0.22]} />
      </mesh>
      <mesh position={[x + 0.9, 6.5, z]} castShadow material={LATTICE_MAT}>
        <boxGeometry args={[0.16, 13, 0.16]} />
      </mesh>
      <mesh position={[x - 0.9, 6.5, z]} castShadow material={LATTICE_MAT}>
        <boxGeometry args={[0.16, 13, 0.16]} />
      </mesh>
      <mesh position={[x, 6.5, z + 0.9]} castShadow material={LATTICE_MAT}>
        <boxGeometry args={[0.16, 13, 0.16]} />
      </mesh>
      <mesh position={[x, 6.5, z - 0.9]} castShadow material={LATTICE_MAT}>
        <boxGeometry args={[0.16, 13, 0.16]} />
      </mesh>
      {rungs}

      {/* Lamp matrix head */}
      <mesh position={[x, 13.2, z]} material={HEAD_MAT}>
        <boxGeometry args={[2.6, 0.85, 1.5]} />
      </mesh>
      {[-0.9, 0, 0.9].map((dx) =>
        [-0.45, 0.45].map((dz) => (
          <mesh key={`${dx}-${dz}`} position={[x + dx, 13.05, z + dz]} material={HEAD_MAT}>
            <boxGeometry args={[0.5, 0.35, 0.55]} />
          </mesh>
        ))
      )}

      <spotLight
        ref={lightRef}
        position={[x, 13.1, z]}
        angle={0.55}
        penumbra={0.58}
        intensity={9}
        color="#fff6e0"
        distance={0}
        decay={1.25}
        castShadow
        shadow-bias={-0.0001}
      />
    </group>
  );
}

function SoftBeam({ x, z }) {
  const { pos, quat, h } = useMemo(() => {
    const from = new THREE.Vector3(x, 10.85, z);
    const to = new THREE.Vector3(0, 0.4, 0);
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    dir.normalize();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const qu = new THREE.Quaternion();
    qu.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { pos: mid, quat: qu, h: len * 0.5 };
  }, [x, z]);

  return (
    <mesh position={pos} quaternion={quat}>
      <coneGeometry args={[2.6, h, 22, 1, true]} />
      <meshBasicMaterial
        color="#fff6dd"
        transparent
        opacity={0.045}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function FloodlightTower({ x, z, targetRef }) {
  const lightRef = useRef(null);

  useLayoutEffect(() => {
    const L = lightRef.current;
    const T = targetRef?.current;
    if (L && T) {
      L.target = T;
      L.target.updateMatrixWorld();
    }
  }, [targetRef]);

  return (
    <group>
      <mesh position={[x, 5.4, z]} castShadow material={POLE_MAT}>
        <cylinderGeometry args={[0.1, 0.16, 10.8, 10]} />
      </mesh>
      <mesh position={[x, 10.85, z]} material={POLE_MAT}>
        <boxGeometry args={[2.35, 0.11, 0.11]} />
      </mesh>
      {[-0.78, -0.26, 0.26, 0.78].map((dx) => (
        <mesh key={dx} position={[x + dx, 11.08, z]} material={HEAD_MAT}>
          <boxGeometry args={[0.34, 0.24, 0.15]} />
        </mesh>
      ))}
      <spotLight
        ref={lightRef}
        position={[x, 10.95, z]}
        angle={0.5}
        penumbra={0.62}
        intensity={7.5}
        color="#fff8ec"
        distance={0}
        decay={1.35}
        castShadow
        shadow-bias={-0.00012}
      />
      <SoftBeam x={x} z={z} />
    </group>
  );
}

export function StadiumFloodlightRig() {
  const targetRef = useRef(null);

  const corners = useMemo(
    () => [
      [27, 23],
      [-27, 23],
      [27, -23],
      [-27, -23],
      [0, 30],
      [0, -30],
      [31, 0],
      [-31, 0],
    ],
    []
  );

  return (
    <group>
      <group ref={targetRef} position={[0, 0.38, 0]} />
      {/* Hero lattice tower — reads like MCG / big-ground mast */}
      <LatticeFloodTower x={-29} z={10} targetRef={targetRef} />
      {corners.map(([x, z]) => (
        <FloodlightTower key={`${x}-${z}`} x={x} z={z} targetRef={targetRef} />
      ))}
    </group>
  );
}
