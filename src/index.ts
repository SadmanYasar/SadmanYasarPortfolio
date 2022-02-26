import {
  Vector2,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  TextureLoader,
  PointsMaterial,
  Points,
} from 'three';

import './styles/style.css';
import star from './assets/star3.png';

let renderer: WebGLRenderer; 
let camera: PerspectiveCamera; 
let scene: Scene; 
let stargeometry: BufferGeometry; 
let stars: Points;

const vertices: Array<number> = [];
const mouse = new Vector2();
const target = new Vector2();
const windowHalf = new Vector2(window.innerWidth / 2, window.innerHeight / 2);

// loader
$(window).on('load', () => {
  $('.loader-wrapper').fadeOut('slow');
});

const init = (): void|null => {
  // scene
  scene = new Scene();

  // contendor
  const contendor = document.getElementById('container');

  if (!contendor) {
    return null;
  }

  // camera controls
  const onMouseMove = (event: { clientX: number; clientY: number; }) => {
    mouse.x = (event.clientX - windowHalf.x);
    mouse.y = (event.clientY - windowHalf.x);
  };
  document.addEventListener('mousemove', onMouseMove, false);

  // responsiveness
  const onWindowResize = () => {
    camera.aspect = contendor.clientWidth / contendor.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(contendor.clientWidth, contendor.clientHeight);
  };
  window.addEventListener('resize', onWindowResize, false);

  // camera
  camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.8, 1000);

  // renderer
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // creates a canvas on container div
  contendor.appendChild(renderer.domElement);

  // Stars
  const vertex = new Vector3();

  for (let index = 0; index < 6000; index++) {
    vertex.x = Math.random() * 600 - 300;
    vertex.y = Math.random() * 600 - 300;
    vertex.z = Math.random() * 600 - 300;

    vertices.push(vertex.x, vertex.y, vertex.z);
  }

  stargeometry = new BufferGeometry();

  stargeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const sprite = new TextureLoader().load(star);
  const starMaterial = new PointsMaterial({
    color: 0xaaaaaa,
    size: 4,
    map: sprite,
  });

  stars = new Points(stargeometry, starMaterial);
  scene.add(stars);
};

let oldValue = 0;
let newValue = 0;

window.addEventListener('scroll', () => {
  // Get the new Value
  newValue = window.pageYOffset;

  // Subtract the two and conclude
  if (oldValue - newValue < 0) {
    // downscroll
    camera.position.z += 0.3;
  } else if (oldValue - newValue > 0) {
    // upscroll
    camera.position.z -= 0.3;
  }

  // Update the old value
  oldValue = newValue;
});

const animate = () => {
  target.x = (1 - mouse.x) * 0.001;
  target.y = (1 - mouse.y) * 0.001;

  camera.rotation.x += 0.03 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.03 * (target.x - camera.rotation.y);

  stars.rotation.z += 0.003;

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

init();
animate();
