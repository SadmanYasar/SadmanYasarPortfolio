//import './style/main.css'
//import * as THREE from './three/build/three.js'
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';



// Canvas
const canvas = document.querySelector('canvas.webgl')


let scene, path, clickcounter, envMap, loader, camera, controls, renderer

let modelToRemove;

// Scene
scene = new THREE.Scene()
//scene.add(new THREE.AxesHelper(5000));

//loadingAnimation
$(window).on("load", function() {
  $(".loader-wrapper").fadeOut("slow");
})

path = ['Model/lambo/',
        'Model/ferrari/', 
        'Model/nissan2/', 
        'Model/porsche2/',
        'Model/nissan1/',
        'Model/nissan3/']
clickcounter = 0;


function init() {
  new RGBELoader()
					.setDataType( THREE.UnsignedByteType )
					.setPath( 'textures/' )
					.load( 'autoshop_01_2k.hdr', function ( texture ) {

						 envMap = pmremGenerator.fromEquirectangular( texture ).texture;

						scene.background = envMap;
						scene.environment = envMap;

						texture.dispose();
						pmremGenerator.dispose();

						tick();

						// model
            loader = new GLTFLoader().setPath( path[clickcounter] );
            loader.load( 'scene2.glb', function ( gltf ) {
              $(".leftbutton").css("pointer-events", "auto");
              $(".rightbutton").css("pointer-events", "auto");
              gltf.scene.traverse( function ( child ) {
              
              $(".waittext").fadeOut();

              if ( child.isMesh ) {
                //child.geometry.center(); // center here
              }

              } );

                  gltf.scene.scale.set(5,5,5) // scale here
                  camera.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 20);
                  
                  scene.add( gltf.scene );

                  modelToRemove = gltf.scene;
                  },




                  // called while loading is progressing
                  function ( xhr ) {
                    $(".leftbutton").css("pointer-events", "none");
                    $(".rightbutton").css("pointer-events", "none");
                    $(".waittext").fadeIn();

                  }
                  )

							tick();

						} );

  /**
   * Camera
   */
  // Base camera

  camera = new THREE.PerspectiveCamera(
    90,
    sizes.width / sizes.height,
    0.1,
    100
  )

  scene.add(camera)

  // Controls
  controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  //controls.autoRotate = true
  // controls.enableZoom = false
  controls.enablePan = false
  controls.dampingFactor = 0.05
  controls.maxDistance = 25
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
  renderer = new THREE.WebGLRenderer({
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

}
//end of init()


$(".rightbutton").click(function(){
  
    clickcounter++;
    if (clickcounter > 5) {
      clickcounter = 5;
    } else {
      scene.remove(modelToRemove);
      loader = new GLTFLoader().setPath( path[clickcounter] );
            loader.load( 'scene2.glb', function ( gltf ) {
              $(".leftbutton").css("pointer-events", "auto");
              $(".rightbutton").css("pointer-events", "auto");
              $(".waittext").fadeOut();

            gltf.scene.traverse( function ( child ) {

              if ( child.isMesh ) {
                //child.geometry.center(); // center here
                            

              }

              } );

                  gltf.scene.scale.set(5,5,5) // scale here
                  camera.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 20);
                  
                  scene.add( gltf.scene );

                  modelToRemove = gltf.scene;
                  },
                  // called while loading is progressing
                  function ( xhr ) {
                    $(".leftbutton").css("pointer-events", "none");
                    $(".rightbutton").css("pointer-events", "none");
                    $(".waittext").fadeIn();

                  }
                  );
                
                  $(".rightbutton").css("pointer-events", "auto");          
    }
  
})

$(".leftbutton").click(function(){
  clickcounter--;
  if (clickcounter < 0) {
    clickcounter = 0;
  } else {
    scene.remove(modelToRemove);
    loader = new GLTFLoader().setPath( path[clickcounter] );
            loader.load( 'scene2.glb', function ( gltf ) {
            $(".leftbutton").css("pointer-events", "auto");
            $(".rightbutton").css("pointer-events", "auto");
            $(".waittext").fadeOut();

            gltf.scene.traverse( function ( child ) {

              if ( child.isMesh ) {
                //child.geometry.center(); // center here
                            
                

              }

              } );

                  gltf.scene.scale.set(5,5,5) // scale here
                  camera.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 20);
                  
                  scene.add( gltf.scene );

                  modelToRemove = gltf.scene;
                  },
                  // called while loading is progressing
                  function ( xhr ) {
                    $(".leftbutton").css("pointer-events", "none");
                    $(".rightbutton").css("pointer-events", "none");
                    $(".waittext").fadeIn();
                  },
                  );
  }
  

})

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
init();
tick()
