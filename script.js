import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js'
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/dist/lil-gui.esm.min.js'; // Import the lil-gui library

// GUI
const gui = new GUI({
  width: 400
})

// Canvas and scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Loading Manager
const loadingManager = new THREE.LoadingManager()
const gltfLoader = new GLTFLoader(loadingManager)

// Load the scene
gltfLoader.load(
  "cosy_hut.glb",
  (gltf) => {
    gltf.scene.position.set(-10, 5, -10)
    scene.add(gltf.scene)
  }
)

// Add scene light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 120)
camera.position.set(3, 3, 1) // Set camera position
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Resize Event
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

// Load the skybox
const loader = new THREE.CubeTextureLoader()
const texture = loader.load([
  'skybox/posx.jpg', // right
  'skybox/negx.jpg', // left
  'skybox/posy.jpg', // top
  'skybox/negy.jpg', // bottom
  'skybox/posz.jpg', // front
  'skybox/negz.jpg'  // back
])
scene.background = texture

// Add fog
scene.fog = new THREE.Fog('#ffffff', 20, 50)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// GUI controls
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -10, 10, 0.1)
cameraFolder.add(camera.position, 'y', -10, 10, 0.1)
cameraFolder.add(camera.position, 'z', -10, 10, 0.1)
cameraFolder.open()