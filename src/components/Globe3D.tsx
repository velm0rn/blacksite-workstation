import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLOBAL_NODES } from '../utils/seededData';
import { useBlacksiteStore } from '../store/useBlacksiteStore';

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export const Globe3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lowPerfMode = useBlacksiteStore((s) => s.lowPerfMode);
  const selectedRegion = useBlacksiteStore((s) => s.selectedRegion);
  const setSelectedNodeId = useBlacksiteStore((s) => s.setSelectedNodeId);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 5.4;

    const renderer = new THREE.WebGLRenderer({ antialias: !lowPerfMode, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(lowPerfMode ? 1 : Math.min(window.devicePixelRatio, 2));
    el.innerHTML = '';
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 8.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.65;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Core dark sphere
    const coreGeo = new THREE.SphereGeometry(1.98, lowPerfMode ? 20 : 36, lowPerfMode ? 20 : 36);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x060b10 });
    globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Wireframe lat/lng grid
    const wireGeo = new THREE.SphereGeometry(2.0, lowPerfMode ? 18 : 32, lowPerfMode ? 14 : 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Equatorial ring
    const ringGeo = new THREE.RingGeometry(2.35, 2.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    globeGroup.add(ring);

    // Nodes & Arcs
    const visibleNodes =
      selectedRegion === 'ALL'
        ? GLOBAL_NODES
        : GLOBAL_NODES.filter((n) => n.region === selectedRegion);

    const nodeMeshes: THREE.Mesh[] = [];
    const pulsePackets: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; t: number; speed: number }[] = [];

    visibleNodes.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, 2.03);
      const markerGeo = new THREE.SphereGeometry(0.055, 10, 10);
      const markerMat = new THREE.MeshBasicMaterial({
        color: node.status === 'DEGRADED' ? 0xff3355 : node.status === 'ELEVATED' ? 0xffb020 : 0x00ff88,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = { nodeId: node.id };
      globeGroup.add(marker);
      nodeMeshes.push(marker);
    });

    for (let i = 0; i < visibleNodes.length - 1; i++) {
      const start = latLngToVector3(visibleNodes[i].lat, visibleNodes[i].lng, 2.03);
      const end = latLngToVector3(visibleNodes[i + 1].lat, visibleNodes[i + 1].lng, 2.03);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.65);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(32);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x00ff88 : 0x00d4ff,
        transparent: true,
        opacity: 0.35,
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));

      if (!lowPerfMode) {
        const pkt = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        globeGroup.add(pkt);
        pulsePackets.push({ curve, mesh: pkt, t: (i * 0.23) % 1, speed: 0.004 + (i % 3) * 0.0015 });
      }
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      if (hits.length > 0 && hits[0].object.userData.nodeId) {
        setSelectedNodeId(hits[0].object.userData.nodeId);
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      pulsePackets.forEach((p) => {
        p.t = (p.t + p.speed) % 1;
        p.mesh.position.copy(p.curve.getPoint(p.t));
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
    };
  }, [lowPerfMode, selectedRegion, setSelectedNodeId]);

  return <div ref={containerRef} className="w-full h-full min-h-[260px] cursor-grab active:cursor-grabbing" />;
};