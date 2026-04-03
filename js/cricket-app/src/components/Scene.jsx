import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars, ContactShadows } from '@react-three/drei';
import { CricketBall } from './CricketBall';
import { usePortfolio } from '../context/PortfolioContext';
import { StadiumStandTiers, StadiumCrowdSilhouette } from './StadiumStands';
import { StadiumFloodlightRig } from './FloodlightRig';

/* Night sky — not pure black (ambient city bounce) */
const SKY = '#050a12';
const FOG_COLOR = '#0c1524';

/** Concentric mowing stripes (MCG-style circular cut) */
function MowedOutfield() {
  const rings = useMemo(() => {
    const list = [];
    const innerStart = 2.4;
    const outerEnd = 17.35;
    const step = 0.72;
    let r = innerStart;
    let i = 0;
    while (r + step < outerEnd) {
      const c1 = i % 2 === 0 ? '#1a5c24' : '#247a32';
      list.push({ inner: r, outer: r + step, color: c1 });
      r += step;
      i++;
    }
    return list;
  }, []);

  return (
    <group>
      {rings.map((ring, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
          <ringGeometry args={[ring.inner, ring.outer, 96]} />
          <meshStandardMaterial color={ring.color} roughness={0.82} metalness={0.03} />
        </mesh>
      ))}
    </group>
  );
}

function PitchAndCrease() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
        <planeGeometry args={[2.1, 11]} />
        <meshStandardMaterial color="#d2b87a" roughness={0.78} />
      </mesh>
      {[-4.5, 4.5].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, z]} receiveShadow>
          <planeGeometry args={[2.25, 0.05]} />
          <meshStandardMaterial color="#f7f7ee" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Dark LED / hoarding ring — grass meets stands */
function PerimeterLED() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]} receiveShadow>
      <ringGeometry args={[17.05, 17.75, 128]} />
      <meshStandardMaterial color="#0c0c0c" roughness={0.45} metalness={0.25} emissive="#0a1520" emissiveIntensity={0.12} />
    </mesh>
  );
}

function BoundaryRope() {
  const pts = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      const rad = 16.85;
      p.push(new THREE.Vector3(Math.cos(a) * rad, 0.08, Math.sin(a) * rad));
    }
    return p;
  }, []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts, true), [pts]);
  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curve, 160, 0.028, 6, true]} />
      <meshStandardMaterial color="#f8f8f0" roughness={0.9} />
    </mesh>
  );
}

function OuterBoundaryLine() {
  const pts = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      p.push(new THREE.Vector3(Math.cos(a) * 16.42, 0.035, Math.sin(a) * 16.42));
    }
    return p;
  }, []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts, true), [pts]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 128, 0.032, 6, true]} />
      <meshStandardMaterial color="#eaeae4" roughness={1} />
    </mesh>
  );
}

function StumpSet({ z }) {
  const group = useRef(null);
  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c9a227', roughness: 0.42, metalness: 0.18 }), []);
  const bailMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8c040', roughness: 0.32, metalness: 0.45 }), []);
  const { stumpShakeRef } = usePortfolio();

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const base = Math.sin(state.clock.elapsedTime * 0.55 + z) * 0.006;
    const shake = stumpShakeRef.current;
    const wobble = shake > 0.01 ? Math.sin(state.clock.elapsedTime * 28) * 0.22 * shake : 0;
    g.rotation.z = base + wobble;
    g.rotation.x = shake * 0.08 * Math.sin(state.clock.elapsedTime * 22);
    stumpShakeRef.current *= 0.94;
  });

  return (
    <group ref={group} position={[0, 0, z]}>
      {[-0.14, 0, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]} castShadow material={wood}>
          <cylinderGeometry args={[0.026, 0.032, 0.74, 8]} />
        </mesh>
      ))}
      {[-0.07, 0.07].map((x) => (
        <mesh key={x} position={[x, 0.74, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={bailMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.17, 6]} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingHotspot({ position, section, geometry, materialProps, openPanel }) {
  const ref = useRef(null);
  const baseY = position[1];

  useFrame((state) => {
    const o = ref.current;
    if (!o) return;
    o.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.85 + section.charCodeAt(0) * 0.01) * 0.14;
    o.rotation.y += 0.006;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      castShadow
      name={section}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        openPanel(section);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

export function Scene() {
  const { openPanel } = usePortfolio();
  const batGeo = useMemo(() => new THREE.BoxGeometry(0.15, 1.25, 0.36), []);
  const trophyGeo = useMemo(() => new THREE.CylinderGeometry(0.32, 0.17, 0.82, 16), []);
  const laptopGeo = useMemo(() => new THREE.BoxGeometry(0.92, 0.055, 0.66), []);
  const phoneGeo = useMemo(() => new THREE.BoxGeometry(0.23, 0.44, 0.035), []);

  return (
    <>
      <color attach="background" args={[SKY]} />
      {/* Softer distance fade — keeps near field crisp like broadcast */}
      <fog attach="fog" args={[FOG_COLOR, 48, 165]} />

      <ambientLight intensity={0.42} color="#b8d4f0" />
      <hemisphereLight intensity={0.38} groundColor="#1e3d1a" color="#dce8f5" />

      <directionalLight position={[-18, 26, -6]} intensity={0.28} color="#ffe8cc" />
      <directionalLight position={[16, 20, 10]} intensity={0.18} color="#b8c8e8" />

      <Stars radius={200} depth={60} count={900} factor={1.4} saturation={0.05} fade speed={0.25} />

      <StadiumStandTiers />
      <StadiumCrowdSilhouette />

      <MowedOutfield />
      <PitchAndCrease />
      <PerimeterLED />
      <BoundaryRope />
      <OuterBoundaryLine />

      <ContactShadows position={[0, 0.012, 0]} opacity={0.28} scale={56} blur={2.2} far={32} />

      <StumpSet z={-4.5} />
      <StumpSet z={4.5} />

      <CricketBall />

      <StadiumFloodlightRig />

      <FloatingHotspot
        position={[-5.2, 1.25, -3.2]}
        section="about"
        geometry={batGeo}
        materialProps={{ color: '#d4a828', roughness: 0.58, metalness: 0.12 }}
        openPanel={openPanel}
      />
      <mesh rotation={[Math.PI / 2, 0, 0.15]} position={[-5.2, 0.06, -3.2]} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
        <torusGeometry args={[0.78, 0.028, 8, 48]} />
        <meshStandardMaterial color="#f5c842" emissive="#f5c842" emissiveIntensity={0.5} transparent opacity={0.75} />
      </mesh>

      <FloatingHotspot
        position={[5.2, 0.72, -3.1]}
        section="skills"
        geometry={trophyGeo}
        materialProps={{ color: '#f5c842', roughness: 0.22, metalness: 0.82, emissive: '#886600', emissiveIntensity: 0.25 }}
        openPanel={openPanel}
      />

      <FloatingHotspot
        position={[0, 0.22, -6.2]}
        section="projects"
        geometry={laptopGeo}
        materialProps={{ color: '#3a3a3a', roughness: 0.35, metalness: 0.78 }}
        openPanel={openPanel}
      />
      <mesh
        position={[0, 0.54, -6.45]}
        rotation={[-0.32, 0, 0]}
        name="projects"
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          openPanel('projects');
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[0.86, 0.56, 0.035]} />
        <meshStandardMaterial color="#051428" emissive="#004488" emissiveIntensity={0.85} roughness={0.12} />
      </mesh>

      <FloatingHotspot
        position={[-5.1, 0.52, 3.2]}
        section="contact"
        geometry={phoneGeo}
        materialProps={{ color: '#1e1e1e', roughness: 0.25, metalness: 0.88 }}
        openPanel={openPanel}
      />

      {/* MCG boundary-line POV: eye height at rope, wide FOV, look across bowl */}
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.04}
        maxPolarAngle={1.48}
        minDistance={3.8}
        maxDistance={58}
        target={[0, 5.8, -16]}
        dampingFactor={0.055}
        enableDamping
      />
    </>
  );
}
