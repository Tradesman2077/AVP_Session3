import * as THREE from 'https://cdn.skypack.dev/three@0.137.5'; 


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

//background 
const bgGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 300, 300);
const bgMat = new THREE.MeshPhongMaterial({
  color: 0x020202,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading});
const bgMesh = new THREE.Mesh(bgGeometry, bgMat);
bgMesh.position.z = -20;
scene.add(bgMesh);
const {array} = bgMesh.geometry.attributes.position;
for(let i = 0; i < array.length; i+=3){
  const x =array[i];
  const y = array[i+1];
  const z = array[i+2];
  array[i + 2] = z + Math.random();
}

//light
const light  = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0 , 1);
scene.add(light);

//renderer            
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//ship
const shootLight = new THREE.SpotLight( 0x00ff00, 1);
shootLight.castShadow = true;
var texture2 = new THREE.TextureLoader().load('imgs/metal.jpg');
var material2 = new THREE.MeshPhongMaterial( { 
  map: texture2,
side: THREE.DoubleSide
} );
const geometry = new THREE.ConeGeometry( 2, 6, 12 );
const ship = new THREE.Mesh( geometry, material2 ); 
ship.position.y = -35;

//enemies
var alienTexture = new THREE.TextureLoader().load('imgs/ship.jpg');
var alienMaterial2 = new THREE.MeshPhongMaterial( { 
  map: alienTexture,
side: THREE.DoubleSide
} );
const alienGeometry = new THREE.IcosahedronGeometry(5, 0);
const alien = new THREE.Mesh(alienGeometry, alienMaterial2);
alien.position.y = 41;

const createNewAlien = () =>{
  //alien.position.x = getRandomStartingPlace();
  alien.position.y = 41;
  scene.add(alien);
}

const alienDeath = () =>{
  scene.remove(alien);
  enemyDeathSound.play();
  enemyDeathSound.pause();// ensure sound is not already playing 
  enemyDeathSound.currentTime = 0; //reset time
  enemyDeathSound.play();
}

//scene
camera.position.z = 50;
shootLight.target = alien;
scene.add( ship );
scene.add(shootLight);
scene.add(alien);

//ship movement
const mouse = {
  x:undefined,
  y: undefined
}
addEventListener('mousemove', (event) => {
  song.play();
  mouse.x = (event.clientX/window.innerWidth)*2 -1;
  mouse.y = -(event.clientY/window.innerHeight) *2 +1;
})

//bullet
const shoot = () =>{
  audio.play();
  audio.pause();// ensure sound is not already playing 
  audio.currentTime = 0; //reset time
  audio.play();
  var bulletTexture = new THREE.TextureLoader().load('imgs/bullet.jpg');
  var bulletMaterial = new THREE.MeshPhongMaterial({ 
    map: bulletTexture,
  side: THREE.DoubleSide
  });
  const geometryBullet = new THREE.SphereGeometry(1, 8, 8);
  const bullet = new THREE.Mesh(geometryBullet, bulletMaterial);
  bullet.position.x = ship.position.x;
  bullet.position.y = ship.position.y;
  bullet.name = 'bullet';
  scene.add(bullet);
  
}
document.addEventListener('click', function() {
  shoot();
  ctx.resume();
});
const getDistance = (projectileX, projectileY, targetX, targetY) => {
  let distanceX  = targetX - projectileX;
  let distanceY = targetY - projectileY;
  return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}
const bulletMove = () => {
  scene.traverse(function (object) {
    if (object.name == 'bullet'){
      object.position.y +=  0.5;
      collision(object);
    }
  });
}
const bulletDelete = () => {
  scene.traverse(function (object) {
    if(object.name == 'bullet' && object.position.y >45){
      scene.remove(object);
    }
  });
}
const collision = (bullet) => {
  if(getDistance(bullet.position.x, bullet.position.y, alien.position.x, alien.position.y) < 4){

    alienDeath();

    scene.remove(bullet);
    createNewAlien();
    alien.position.x = getRandomStartingPlace();
  }
}
const getRandomStartingPlace = () =>{
  let min = 1;
  let max = window.innerWidth;
  if(Math.round(Math.random()) == 0){
    return Math.round( Math.random() * (max - min) + min)/25;
  }
  else{
    return - Math.round( Math.random() * (max - min) + min)/25;
  }
}


//sound
var audio = new Audio("sfx/blast.wav");
var enemyDeathSound = new Audio('sfx/blastEnemy.wav');
var song = new Audio('sfx/gameSong2.wav'); 
song.volume = 0.38;
if(typeof song.loop == 'boolean')
{
    song.loop = true;
}
else
{
    song.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}


//animate
const animate = function() {
  requestAnimationFrame( animate );
  
  renderer.render( scene, camera );
  ship.position.x = mouse.x*window.innerWidth/10;
  ship.position.y = mouse.y*window.innerHeight/10;
  shootLight.position.x = mouse.x*window.innerWidth/10;
  shootLight.position.y = mouse.y*window.innerHeight/10;
  ship.rotation.y += 0.05;

  bulletMove();
  bulletDelete();
  
  bgMesh.rotation.z +=0.0006;

  //ROTATE PLANE
  if(bgMesh.rotation.x < 0.15 && bgMesh.rotation.y < 0.15){
    bgMesh.rotation.x +=0.0006;
    bgMesh.rotation.y +=0.0006;
    
  }
  else{
    bgMesh.rotation.x -=0.001;
    bgMesh.rotation.y -=0.001;
  }
  alien.rotation.x += 0.02;
  alien.rotation.y += 0.05;
  alien.position.y -= 0.1;

};
animate();

