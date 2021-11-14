/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-relative-packages */

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

let envMap; let loader; let camera; let controls; let
  renderer;
let layerIndex = 0;

// Scene
const scene = new THREE.Scene();

const path = ['Model/lambo/scene2.glb',
  'Model/ferrari/scene2.glb',
  'Model/nissan2/scene2.glb',
  'Model/porsche2/scene2.glb',
  'Model/nissan1/scene2.glb',
  'Model/nissan3/scene2.glb'];

/**
  * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const init = () => {
  /**
   * Camera
   */
  camera = new THREE.PerspectiveCamera(
    90,
    sizes.width / sizes.height,
    0.1,
    100,
  );

  camera.position.set(0, 0, 20);

  camera.layers.set(layerIndex);

  scene.add(camera);

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath('textures/')
    .load('autoshop_01_2k.hdr', (texture) => {
      envMap = pmremGenerator.fromEquirectangular(texture).texture;

      scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();

      // model
      loader = new GLTFLoader();

      const loadModel = (url, layer) => loader
        .loadAsync(url)
        .then((gltf) => {
          gltf.scene.scale.set(5, 5, 5);
          gltf.scene.traverse((object) => {
            object.layers.set(layer);
          });

          scene.add(gltf.scene);
        });

      loadModel(path[0], 0)
        .then((result) => loadModel(path[1], 1))
        .then((result) => loadModel(path[2], 2))
        .then((result) => loadModel(path[3], 3))
        .then((result) => loadModel(path[4], 4))
        .then((result) => loadModel(path[5], 5))
        .then((result) => $('.loader-wrapper').fadeOut('slow'))
        .catch((error) => console.log(error));
    });

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 25;
  controls.minDistance = 15;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 3;
};

$('.rightbutton').click(() => {
  layerIndex += 1;
  if (layerIndex > 5) {
    layerIndex = 5;
  } else {
    camera.layers.set(layerIndex);
  }
});

$('.leftbutton').click(() => {
  layerIndex -= 1;
  if (layerIndex < 0) {
    layerIndex = 0;
  } else {
    camera.layers.set(layerIndex);
  }
});

window.addEventListener('resize', () => {
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
 * Animate
 */
const tick = () => {
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
init();
tick();
