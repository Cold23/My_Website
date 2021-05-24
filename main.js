import * as THREE from './node_modules/three/build/three.module.js';

import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const light = new THREE.AmbientLight(0xffffff);

const dLight = new THREE.DirectionalLight(0xffffff, 2);

scene.add(light);
scene.add(dLight);

const rendered = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

const controls = new OrbitControls(camera, rendered.domElement);

function addStar() {

  const shape = new THREE.SphereGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const star = new THREE.Mesh(shape, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);

  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTex = new THREE.TextureLoader().load('space.png');

scene.background = spaceTex;


rendered.setPixelRatio(window.devicePixelRatio);

rendered.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

rendered.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });

const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  rendered.render(scene, camera);
}

animate();

