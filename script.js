import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/geometries/TextGeometry.js'

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
    gltf.scene.position.set(1, 5, -10)
    // roatete the scene slghtly
    gltf.scene.rotation.y = -(Math.PI / 4)
    scene.add(gltf.scene)
  }
)

// Add scene light
const ambientLight = new THREE.AmbientLight(0x90d5ff, 0.5)
scene.add(ambientLight)

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 120)
camera.position.set(0, 0, 20) // Adjust camera position
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
scene.fog = new THREE.Fog('#ffffff', 20, 100)

// Function to calculate time until Christmas
const calculateTimeUntilChristmas = () => {
  const today = new Date()
  const christmas = new Date(today.getFullYear(), 11, 25)
  if (today.getMonth() === 11 && today.getDate() > 25) {
    christmas.setFullYear(christmas.getFullYear() + 1)
  }
  const timeUntilChristmas = christmas - today
  const days = Math.floor(timeUntilChristmas / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeUntilChristmas % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilChristmas % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeUntilChristmas % (1000 * 60)) / 1000)
  return `${days} : ${hours} : ${minutes} : ${seconds}`
}

// Load font and add text
const fontLoader = new FontLoader()
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  let textGeometry = new TextGeometry(calculateTimeUntilChristmas(), {
    font: font,
    size: 1,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  })
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 })
  let textMesh = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(textMesh)

  // Animate
  const clock = new THREE.Clock()

  const tick = () =>
  {
    const elapsedTime = clock.getElapsedTime()

    // Update the text geometry
    scene.remove(textMesh)
    textGeometry = new TextGeometry(calculateTimeUntilChristmas(), {
      font: font,
      size: 1,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,

    })
    textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(0, 0, 0)
    textMesh.geometry.center() // Center the text
    scene.add(textMesh)

    // Make the text face the camera
    textMesh.quaternion.copy(camera.quaternion)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
})

// GUI controls
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -10, 10, 0.1)
cameraFolder.add(camera.position, 'y', -10, 10, 0.1)
cameraFolder.add(camera.position, 'z', -10, 10, 0.1)
cameraFolder.open()