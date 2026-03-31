import './style.css'

import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import interFont from './inter_semibold.json'

let scene, camera, renderer, effect;
let textMesh;

const textWidth = 50; // some appropriate value based on the TextGeometry as defined in init()
const cameraDistance = 40; // camera Z position

const start = Date.now();

const effectContainer = document.querySelector('#effect-container');

if (effectContainer === null) {
  console.error("couldn't fetch effect container element...");
}

function calculateFOV(objectWidth, cameraDistance, aspectRatio) {
  // calc horizontal FOV first
  const hFOV = 2 * Math.atan((objectWidth / 2) / cameraDistance);

  // convert horizontal FOV to vertical FOV since that's what threeJS uses
  const vFOV = 2 * Math.atan(Math.tan(hFOV / 2) / aspectRatio);

  return THREE.MathUtils.radToDeg(vFOV);
}

function init() {
  if (effectContainer === null) {
    return;
  }

  //// scene and camerasetup
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0, 0, 0 );

  const aspectRatio = effectContainer.clientWidth / effectContainer.clientHeight;
  const FOV = calculateFOV(textWidth, cameraDistance, aspectRatio);

  camera = new THREE.PerspectiveCamera( FOV, aspectRatio, 0.1, 1000 );
  camera.position.setZ(cameraDistance);

  //// lights setup
  const pointLight1 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight1.position.set( -10, -10, -10 );
  scene.add( pointLight1 );

  const pointLight2 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight2.position.set( 0, 0, 10 );
  scene.add( pointLight2 );

  const pointLight3 = new THREE.PointLight( 0xffffff, 3, 0, 0 );
  pointLight3.position.set( 10, 10, 10 );
  scene.add( pointLight3 );

  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5, 0, 0 );
  scene.add( ambientLight );


  //// text setup

  // load font
  const font = new FontLoader().parse(interFont);

  // create text geometry using font
  const geometry = new TextGeometry('WINSOC', {
    font: font,
    size: 8, 
    depth: 2,
  });

  // set center position on geometry for rotation
  geometry.center();

  const material = new THREE.MeshStandardMaterial( { color: 0xFFA500} );

  textMesh = new THREE.Mesh( geometry, material );

  scene.add(textMesh);

  //// renderer
  const canvasElement = document.querySelector('#aascii');

  if (canvasElement === null) {
    console.error("couldn't fetch canvas element...");
    return;
  }

  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  });

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( effectContainer.clientWidth, effectContainer.clientHeight );

  //// effect

  effect = new AsciiEffect( renderer, ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$', { invert: true, resolution: 0.3 } );
  effect.setSize( effectContainer.clientWidth, effectContainer.clientHeight );
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'transparent';


  // special case for effect

  effectContainer.appendChild( effect.domElement );

  //// add event listener to fix on resize window
  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  if (effectContainer === null) {
    return;
  }

  const aspectRatio = effectContainer.clientWidth / effectContainer.clientHeight;

  camera.fov = calculateFOV(textWidth, cameraDistance, aspectRatio);
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();

  renderer.setSize( effectContainer.clientWidth, effectContainer.clientHeight );
  effect.setSize( effectContainer.clientWidth, effectContainer.clientHeight );
}

function animate() {
  requestAnimationFrame( animate );

  render();
}

function render() {
  const timer = Date.now() - start;

  textMesh.rotation.z = Math.sin(timer * 0.002) / 7.1235;

  textMesh.rotation.y += 0.005;

  effect.render( scene, camera );
}

init();
animate();
