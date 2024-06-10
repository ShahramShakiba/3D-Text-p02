import * as THREE from 'three';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl'); // Canvas
const scene = new THREE.Scene(); // Scene
const gui = new GUI(); // Debug

const axesHelper = new THREE.AxesHelper(); // Axes Helper
// scene.add(axesHelper);

//======================= Textures ========================
const textureLoader = new THREE.TextureLoader();
const matcapTextTexture = textureLoader.load('/textures/matcaps/1.png');
const matcapDonutTexture = textureLoader.load('/textures/matcaps/4.png');

// Arrays to hold the donuts and their rotation speeds
const donuts = [];
const rotationSpeeds = [];

//======================= Fonts ========================
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Creative Developer \n& Curious Mind', {
    font,
    size: 0.4,
    height: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  /* Center the Text */
  /* textGeometry.computeBoundingBox();
  textGeometry.translate(
    -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // - bevelSize
    -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // - bevelSize
    -(textGeometry.boundingBox.max.z - 0.03) * 0.5 // - bevelThickness
  ); */
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTextTexture,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  console.time('donuts');

  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapDonutTexture,
  });
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 1000; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    // position from both side - left & right
    donut.position.x = (Math.random() - 0.5) * 25;
    donut.position.y = (Math.random() - 0.5) * 25;
    donut.position.z = (Math.random() - 0.5) * 25;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
    donuts.push(donut);

    const rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.01,
    };
    rotationSpeeds.push(rotationSpeed);
  }

  console.timeEnd('donuts');
});

//====================== Camera ==========================
let width = window.innerWidth;
let height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

//=================== Orbit Controls =====================
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//===================== Renderer =========================
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//==================== Resize Listener ===================
window.addEventListener('resize', () => {
  // Update sizes
  width = window.innerWidth;
  height = window.innerHeight;

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//==================== Animate ==========================
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  donuts.forEach((donut, index) => {
    const speed = rotationSpeeds[index];

    donut.rotation.x += speed.x;
    donut.rotation.y += speed.y;
    donut.rotation.z += speed.z;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
