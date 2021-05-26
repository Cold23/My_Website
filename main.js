import * as THREE from './node_modules/three/build/three.module.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Quaternion } from 'three';

var doRotate = false;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const light = new THREE.AmbientLight(0xffffff, 0.8);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);

scene.add(light);
scene.add(pointLight);


const rendered = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

function addStar() {

  const shape = new THREE.SphereGeometry(0.25);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const star = new THREE.Mesh(shape, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);

  scene.add(star);
}

Array(200).fill().forEach(addStar);

const loader = new THREE.TextureLoader();

const spaceTex = loader.load('space.png');

scene.background = spaceTex;


const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });

const torus = new THREE.Mesh(geometry, material);

const earthTexture = loader.load("./earth/earth.png")
const earthNormal = loader.load("./earth/earth_normal.tif")

const moonTex = loader.load("./earth/moon.jpg");
const moonNormal = loader.load("./earth/moon_normal.png");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 50, 50),
  new THREE.MeshStandardMaterial({ map: moonTex, normalMap: moonNormal })
)



const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshStandardMaterial({ map: earthTexture, normalMap: earthNormal })
);

const moonPivot = new THREE.Object3D();

earth.add(moonPivot);
moonPivot.add(moon);

moon.position.x = -10;


const earthCenter = new THREE.Object3D();



earthCenter.add(earth)

earth.position.x = -25;

earth.position.z = 30;

scene.add(earthCenter);

scene.add(torus);

const objectLoader = new GLTFLoader();

const spaceShip = await objectLoader.loadAsync('./spaceshuttle.glb');

const shuttleScene = spaceShip.scene;
shuttleScene.rotation.y = THREE.MathUtils.degToRad(90);
shuttleScene.rotation.z = THREE.MathUtils.degToRad(-10);
shuttleScene.position.x = -90;
shuttleScene.position.y = -20;
shuttleScene.position.z = -20;
scene.add(shuttleScene);


var percent = 0;

function moveCamera() {

  const h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';

  percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;

  torus.rotation.x += 0.1;
  torus.rotation.y += 0.05;
  torus.rotation.z += 0.1;

  earth.rotation.x += 0.1;
  earth.rotation.y += 0.05;
  earth.rotation.z += 0.1;

  camera.position.z = percent * 0.7;
  camera.position.x = percent * 0.02;
  camera.position.y = percent * 0.02;


  const lerpTime = percent / 100.0;

  shuttleScene.position.x = THREE.MathUtils.lerp(-120, 150, lerpTime);
  shuttleScene.position.y = THREE.MathUtils.lerp(-20, 20, lerpTime);
  shuttleScene.rotation.x = THREE.MathUtils.lerp(THREE.MathUtils.degToRad(-5), THREE.MathUtils.degToRad(90), lerpTime * lerpTime);


}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  earth.rotateZ(0.001);
  if (percent > 95.0) {
    earthCenter.rotateX(0.0005);
    earthCenter.rotateY(0.005);
    earthCenter.rotateZ(0.0001);

  } else {
    earth.position.x = -25;
    earth.position.z = 30;

    earthCenter.quaternion.slerp(new THREE.Quaternion().identity(), 0.05);


    // earthCenter.rotation.y = 0;
    // earthCenter.rotation.z = 0;
    // earthCenter.rotation.x = 0;
  }

  if (percent > 2) {
    doRotate = true;
  }
  if (doRotate) {

    moonPivot.rotateX(0.005);
    moonPivot.rotateZ(0.01);
  }

  // Update Canvas

  rendered.setPixelRatio(window.devicePixelRatio);

  rendered.setSize(window.innerWidth, window.innerHeight);

  rendered.render(scene, camera);
}


animate();

