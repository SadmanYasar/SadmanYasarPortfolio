//import './style/main.css'
//import * as THREE from './three/build/three.js'
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from './three/examples/jsm/utils/RoughnessMipmapper.js';
/**
 * GUI Controls
 */
import * as dat from './dat.gui/build/dat.gui.module.js'
const gui = new dat.GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

var mixer;

// Scene
const scene = new THREE.Scene()
//scene.add(new THREE.AxesHelper(500));

new RGBELoader()
					.setDataType( THREE.UnsignedByteType )
					.setPath( 'textures/' )
					.load( 'autoshop_01_2k.hdr', function ( texture ) {

						const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

						scene.background = envMap;
						scene.environment = envMap;

						texture.dispose();
						pmremGenerator.dispose();

						tick();

						// model

						// use of RoughnessMipmapper is optional
						const roughnessMipmapper = new RoughnessMipmapper( renderer );

						const loader = new GLTFLoader().setPath( 'Model/Lambo2/' );
						loader.load( 'scene.gltf', function ( gltf ) {

							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									roughnessMipmapper.generateMipmaps( child.material );

								}

							} );

							scene.add( gltf.scene );

          
        } );



							roughnessMipmapper.dispose();

							tick();

						} );






/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

//camera.rotation.y += 180

/* camera.position.x = 1
camera.position.y = 100
camera.position.z = 1500 */

camera.position.set(0.113, 12.918, 31.374)


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//controls.autoRotate = true
// controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 45
controls.minDistance = 15
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
}
controls.minPolarAngle = Math.PI/3;
controls.maxPolarAngle = Math.PI/3;



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();


/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)
  //object.rotation.z += 0.01 * Math.sin(1)

  // Update controls
  controls.update()
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
