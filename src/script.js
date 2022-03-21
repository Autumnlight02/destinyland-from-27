import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import Model from "./model";

const relativePath = "https://cdn.jsdelivr.net/gh/Autumnlight02/destinyland-from-27@master/dist";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Lights
const light = new THREE.AmbientLight("purple", 0.2);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
// camera.position.set(1, 0, 4)
camera.position.z = 5;
camera.position.y = 2;

/**
 * the juice
 */

//MESH
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube)

//Models
const gem = new Model({
  name: "gem",
  file: relativePath + "/models/marquise-double.glb",
  color1: "midnightblue",
  color2: "darkgoldenrod",
  scene: scene,
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

//LOOP
const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (gem.isActive) {
    gem.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();
  }
};
animate;

const tick = () => {
  // Update controls
  controls.update();

  requestAnimationFrame(animate);

  // Render
  renderer.render(scene, camera);

  //TODO throws errors
  //gem.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime();

  //   // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
function render() {
  // Rotate the scene a little on each frame
  // scene.rotation.y += 0.01;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);
