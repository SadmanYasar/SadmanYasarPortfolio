"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const three_1 = require("three");
let renderer;
let camera;
let scene;
let stargeometry;
let stars;
const vertices = [];
const mouse = new three_1.Vector2();
const target = new three_1.Vector2();
const windowHalf = new three_1.Vector2(window.innerWidth / 2, window.innerHeight / 2);
// loader
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
$(window).on('load', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    $('.loader-wrapper').fadeOut('slow');
});
const init = () => {
    // scene
    scene = new three_1.Scene();
    // contendor
    const contendor = document.getElementById('container');
    if (!contendor) {
        return null;
    }
    // camera controls
    function onMouseMove(event) {
        mouse.x = (event.clientX - windowHalf.x);
        mouse.y = (event.clientY - windowHalf.x);
    }
    document.addEventListener('mousemove', onMouseMove, false);
    // responsiveness
    function onWindowResize() {
        camera.aspect = contendor.clientWidth / contendor.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(contendor.clientWidth, contendor.clientHeight);
    }
    window.addEventListener('resize', onWindowResize, false);
    // camera
    camera = new three_1.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.8, 1000);
    // renderer
    renderer = new three_1.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // creates a canvas on container div
    contendor.appendChild(renderer.domElement);
    // Stars
    const vertex = new three_1.Vector3();
    for (let index = 0; index < 6000; index++) {
        vertex.x = Math.random() * 600 - 300;
        vertex.y = Math.random() * 600 - 300;
        vertex.z = Math.random() * 600 - 300;
        vertices.push(vertex.x, vertex.y, vertex.z);
    }
    stargeometry = new three_1.BufferGeometry();
    stargeometry.setAttribute('position', new three_1.Float32BufferAttribute(vertices, 3));
    const sprite = new three_1.TextureLoader().load('star3.png');
    const starMaterial = new three_1.PointsMaterial({
        color: 0xaaaaaa,
        size: 4,
        map: sprite,
    });
    stars = new three_1.Points(stargeometry, starMaterial);
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
    }
    else if (oldValue - newValue > 0) {
        // upscroll
        camera.position.z -= 0.3;
    }
    // Update the old value
    oldValue = newValue;
});
const animate = () => {
    requestAnimationFrame(animate);
    target.x = (1 - mouse.x) * 0.001;
    target.y = (1 - mouse.y) * 0.001;
    camera.rotation.x += 0.03 * (target.y - camera.rotation.x);
    camera.rotation.y += 0.03 * (target.x - camera.rotation.y);
    stars.rotation.z += 0.003;
    renderer.render(scene, camera);
};
init();
animate();
