import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./styles/Three.css";

const ThreeCoolComponent = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const sphereRef = useRef();

  useEffect(() => {
    renderer.setClearColor(0x0000000, 0);
    document.getElementById("three-container").appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(sin(gl_FragCoord.x * 0.01), cos(gl_FragCoord.y * 0.01), 0.5, 1.0);
        }
      `,
    });

    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    camera.position.z = 5;

    const update = () => {
      sphere.rotation.x += 0.005;
      sphere.rotation.y += 0.005;
    };

    const render = () => {
      renderer.setSize( 400, 200);

      update();

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    };

    render();

    sphereRef.current = sphere;

    return () => {
      const containerElement = document.getElementById("three-container");

      if (containerElement && containerElement.firstChild) {
        containerElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="three-container" />;
};

export default ThreeCoolComponent;
