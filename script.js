import * as THREE from "./three/build/three.module.js";
    import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
    
    let renderer, camera, scene, mesh, star, stargeometry, material, loader, stars,obj;
    let vertices = [];
    let r, color, intensity, light  ;
    let mouse, target, windowHalf;
    mouse = new THREE.Vector2();
    target = new THREE.Vector2();
    windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );


    //loader
    $(window).on("load", function() {
        $(".loader-wrapper").fadeOut("slow");
    })

    
   
    function init() {
        
        //scene
        scene = new THREE.Scene();

        //camera controls
        document.addEventListener( 'mousemove', onMouseMove, false );
        function onMouseMove( event ) {
        mouse.x = ( event.clientX - windowHalf.x );
        mouse.y = ( event.clientY - windowHalf.x );
        }

        //responsiveness
        window.addEventListener( 'resize', onWindowResize, false );
        function onWindowResize() {

         camera.aspect = contenedor.clientWidth / contenedor.clientHeight;

         camera.updateProjectionMatrix();

         renderer.setSize(contenedor.clientWidth, contenedor.clientHeight);
         }   
         

         //camera
        camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.8, 1000 );
        

        //renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio( window.devicePixelRatio );


        //creates a canvas on container div
        let contenedor = document.getElementById('container');
        contenedor.appendChild(renderer.domElement);

        //Stars
        const vertex = new THREE.Vector3();

        r = new THREE.BufferGeometry();

        for (let index = 0; index < 6000; index++) {
           
              vertex.x=  Math.random() * 600-300; 
              vertex.y=  Math.random() * 600-300;
              vertex.z=  Math.random() * 600-300;
            
             vertices.push( vertex.x, vertex.y, vertex.z ); 


        }

        stargeometry = new THREE.BufferGeometry();

        stargeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );


        let sprite = new THREE.TextureLoader().load('star3.png');
        let starMaterial = new THREE.PointsMaterial({
                color: 0xaaaaaa,
                size: 4,
                map: sprite
            });

        stars = new THREE.Points( stargeometry, starMaterial );    
        scene.add(stars);
        
  }


   let oldValue = 0;
   let newValue = 0;

  window.addEventListener('scroll', function(e){

  // Get the new Value
  newValue = window.pageYOffset;

  //Subtract the two and conclude
  if(oldValue - newValue < 0){
      //downscroll
      camera.position.z += 0.3;

  } else if(oldValue - newValue > 0){
      //upscroll
        camera.position.z -= 0.3;

  } 

  // Update the old value
  oldValue = newValue;

  });



    

    function animate() {
        requestAnimationFrame(animate);

        target.x = ( 1 - mouse.x ) * 0.001;
        target.y = ( 1 - mouse.y ) * 0.001;
  
        camera.rotation.x += 0.03 * ( target.y - camera.rotation.x );
        camera.rotation.y += 0.03 * ( target.x - camera.rotation.y );

        //stars.rotation.z += 0.003;

        renderer.render(scene,camera);

    }
    init();
    animate();

    

