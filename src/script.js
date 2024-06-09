import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';


const canvas = document.querySelector('canvas.webgl'); // Canvas
const scene = new THREE.Scene(); // Scene
const gui = new GUI(); // Debug

//==================== Textures =======================
const textureLoader = new THREE.TextureLoader();

//==================== Objects ========================
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

scene.add(cube);

//==================== Resize Listener ===================
let width = window.innerWidth;
let height = window.innerHeight;

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

//====================== Camera ==========================
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
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//==================== Animate ===========================
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
