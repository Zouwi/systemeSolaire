import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */

// Debug Importer lil gui et l'instancier ici si besoin


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene Créer la scene ici
const scene = new THREE.Scene()



/**
 * Textures Instancier le textureLoader ici pour ajouter les textures
 */
const textureLoader = new THREE.TextureLoader();

/** Instancier le modelLoader**/
const modelLoader = new GLTFLoader();

//ajout d'une fusée
let rocket;
modelLoader.load('model/rocket.glb', function (gltf) {
        rocket = gltf.scene;  // Assurez-vous que tv est une variable accessible à un niveau supérieur
        rocket.scale.set(1, 1, 1);
        rocket.position.z = 0;
        rocket.position.x = 20;
        rocket.position.y = 0;
        rocket.rotation.y = -0.9;
        rocket.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        })
        scene.add(rocket);
    },
    undefined, function (error) {
        console.error(error);
    });

/**
 * Objects
 */
// Fonction pour créer une planète
function createPlanet(radius, distance, texturePath) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    return planet;
}

// Créer le soleil
const sun = createPlanet(10, 0, 'textures/sunmap.png');

// Créer les planètes
const mercury = createPlanet(0.1, 17, 'textures/mercurymap.png');
const venus = createPlanet(0.2, 22, 'textures/venusmap.png');
const earth = createPlanet(0.3, 27, 'textures/earthmap.png');
const mars = createPlanet(0.2, 32, 'textures/marsmap.png');
const jupiter = createPlanet(1.5, 45, 'textures/jupitermap.png');
const saturne = createPlanet(1.2, 55, 'textures/saturnmap.png');
const uranus = createPlanet(0.8, 65, 'textures/uranusmap.png');
const neptune = createPlanet(0.8, 75, 'textures/neptunemap.png');

//Anneaux de saturne
const saturnRingGeometry = new THREE.RingGeometry(1.8, 2.5, 64);
const saturnRingTexture = textureLoader.load('textures/saturnringmap.png');
const saturnRingMaterial = new THREE.MeshBasicMaterial({ map: saturnRingTexture, side: THREE.DoubleSide });
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = 1.2;
saturne.add(saturnRing);

// Fonction pour créer une ligne représentant une orbite
function createOrbitLine(radius) {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        points.push(new THREE.Vector3(x, 0, y));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineLoop(geometry, material);

    return line;
}

// Créer les lignes pour les orbites
const orbit = createOrbitLine(17);
scene.add(orbit);

const orbit2 = createOrbitLine(22);
scene.add(orbit2);

const orbit3 = createOrbitLine(27);
scene.add(orbit3);

const orbit4 = createOrbitLine(32);
scene.add(orbit4);

const orbit5 = createOrbitLine(45);
scene.add(orbit5);

const orbit6 = createOrbitLine(55);
scene.add(orbit6);

const orbit7 = createOrbitLine(65);
scene.add(orbit7);

const orbit8 = createOrbitLine(75);
scene.add(orbit8);

//Particules étoiles
const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 100);
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//ajouter la lumière sur toute la scène
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

//ajouter la lumière sur le soleil
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 0;

scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
 * Camera  Ajouter une camera ici
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 30
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    // Rotation de chaque planète
    [sun, mercury, venus, earth, mars, jupiter, saturne, uranus, neptune].forEach(planet => {
        planet.rotation.y = elapsedTime * 0.1;
    });

    // Rotation de la terre autour du soleil
    earth.position.x = Math.cos(elapsedTime * 0.5) * 27;
    earth.position.z = Math.sin(elapsedTime * 0.5) * 27;

    //Rotation des autres planètes autour du soleil
    mercury.position.x = Math.cos(elapsedTime * 0.8) * 17;
    mercury.position.z = Math.sin(elapsedTime * 0.8) * 17;

    venus.position.x = Math.cos(elapsedTime * 0.7) * 22;
    venus.position.z = Math.sin(elapsedTime * 0.7) * 22;

    mars.position.x = Math.cos(elapsedTime * 0.4) * 32;
    mars.position.z = Math.sin(elapsedTime * 0.4) * 32;

    jupiter.position.x = Math.cos(elapsedTime * 0.2) * 45;
    jupiter.position.z = Math.sin(elapsedTime * 0.2) * 45;

    saturne.position.x = Math.cos(elapsedTime * 0.1) * 55;
    saturne.position.z = Math.sin(elapsedTime * 0.1) * 55;

    uranus.position.x = Math.cos(elapsedTime * 0.05) * 65;
    uranus.position.z = Math.sin(elapsedTime * 0.05) * 65;

    neptune.position.x = Math.cos(elapsedTime * 0.03) * 75;
    neptune.position.z = Math.sin(elapsedTime * 0.03) * 75;

    //animation de la fusée de haut en bas
    if (rocket) {
        rocket.position.y = Math.sin(elapsedTime) * 5;
    }

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();