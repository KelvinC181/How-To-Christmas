import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js'

class ChristmasScene {
  constructor() {
    this.mixer = null
    this.clock = new THREE.Clock()
    this.lastUpdate = 0
    this.updateInterval = 1000 // Update text every second
    this.scene = new THREE.Scene()
    this.setupCanvas()
    this.setupCamera()
    this.setupRenderer()
    this.setupLights()
    this.setupResizeHandler()
    this.loadAssets()
    this.firstRenderComplete = false;
  }

  setupCanvas() {
    this.canvas = document.querySelector('canvas.webgl')
    this.sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(40, this.sizes.width / this.sizes.height, 0.1, 120)
    this.camera.position.set(0, 0, 10)
    this.scene.add(this.camera)
}

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0xaaaaff)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 30;
    this.controls.maxPolarAngle = Math.PI / 2;
    // disable panning and zoom
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
  }

  setupLights() {
    // Ambient light for overall scene brightness
    const ambientLight = new THREE.AmbientLight(0x90d5ff, 0.5)
    this.scene.add(ambientLight)

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xd88eff, 1)
    directionalLight.position.set(0, 3, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
        
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

  loadAssets() {
    const loadingManager = new THREE.LoadingManager()
    this.loadModel(loadingManager)
    this.loadFont()
  }

  loadModel(loadingManager) {
    const gltfLoader = new GLTFLoader(loadingManager)
    
    loadingManager.onProgress = (url, loaded, total) => {
        console.log(`Loading: ${(loaded / total * 100)}%`);
    }
    
    loadingManager.onError = (url) => {
        console.error(`Error loading ${url}`);
    }

    // Load Christmas tree model
    gltfLoader.load('assets/models/christmastree.gltf', (gltf) => {
      this.tree = gltf.scene
      this.tree.scale.set(0.5, 0.5, 0.5)
      this.tree.position.set(0, -2, 0)
      this.tree.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
      });
      // make the baubles glow
      this.tree.traverse((child) => {
          if (child.isMesh && child.name.includes('lights')) {
              child.material.emissive = new THREE.Color(0xff0000)
              child.material.emissiveIntensity = 2
          }
      })
      this.scene.add(this.tree)
  })

  gltfLoader.load('assets/models/present.gltf', (gltf) => {
      this.gift = gltf.scene
      this.gift.scale.set(0.5, 0.5, 0.5)
      this.gift.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
      });
      // Add gifts randomly
      for (let i = 0; i < 20; i++) {
          const gift = this.gift.clone()
          gift.position.set(Math.random() * 20 - 10, -1.75, Math.random() * 20 - 10)
          this.scene.add(gift)
          
      }
  })
  
  gltfLoader.load('assets/models/santa.gltf',
    (gltf) => {
        this.santa = gltf.scene;
        this.santa.scale.set(1, 1, 1);
        this.santa.position.set(2, -2, 0);
        this.scene.add(this.santa);
        this.santa.traverse((child) => {
          if (child.isMesh) {
              child.castShadow = true;
          }
        });

        // Store mixer as class property
        this.mixer = new THREE.AnimationMixer(this.santa);
        if (gltf.animations && gltf.animations.length) {
            const clip = gltf.animations[0];
            const action = this.mixer.clipAction(clip);
            action.play();
        }
    }
  )

    // load second santa
    gltfLoader.load(
      'assets/models/santa.gltf',
      (gltf) => {
          this.santa2 = gltf.scene;
          this.santa2.scale.set(1, 1, 1);
          // Position second Santa to the left
          this.santa2.position.set(-2, -2, 0);
          this.scene.add(this.santa2);
          this.santa2.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
          });
  
          // Store second mixer as class property
          this.mixer2 = new THREE.AnimationMixer(this.santa2);
          if (gltf.animations && gltf.animations.length) {
            const clip = gltf.animations[1];  
            const action = this.mixer2.clipAction(clip);
            action.play();
          }
      }
  );

    // create a snow floor texture
const snowTexture = new THREE.TextureLoader().load('assets/textures/snow_diff.webp')
const snowNormal = new THREE.TextureLoader().load('assets/textures/snow_nor.webp')
const snowArm = new THREE.TextureLoader().load('assets/textures/snow_arm.webp')

const snowMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xffffff,
  map: snowTexture,
  normalMap: snowNormal,
  normalScale: new THREE.Vector2(2.0, 2.0),
  aoMap: snowArm,
  roughness: 0.9,
  metalness: 0.1,
  emissive: 0x112233,
  emissiveIntensity: 0.1,
  displacementMap: snowNormal,
  displacementScale: 0.2,
})

snowTexture.wrapS = THREE.RepeatWrapping
snowTexture.wrapT = THREE.RepeatWrapping
snowTexture.repeat.set(40, 40)

  const snowGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
  const snow = new THREE.Mesh(snowGeometry, snowMaterial)
  snow.rotation.x = -Math.PI / 2
  snow.position.y = -2
  snow.receiveShadow = true // Enable shadow receiving
  this.scene.add(snow)
}

  calculateTimeUntilChristmas() {
    const now = new Date()
    const christmas = new Date(now.getFullYear(), 11, 25)
    if (now.getMonth() === 11 && now.getDate() > 25) {
        christmas.setFullYear(christmas.getFullYear() + 1)
    }
    const diff = christmas - now
    
    return {
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
    }
}

updateCountdownText() {
    const time = this.calculateTimeUntilChristmas()
    return `${time.days} : ${time.hours} : ${time.minutes} : ${time.seconds}`
}

loadFont() {
  const fontLoader = new FontLoader()
  fontLoader.load('https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json', 
      (font) => {
          this.font = font
          this.createText()
          this.startAnimation()
      }
  )
}

createText() {
    if (!this.textGeometry) {
        this.textGeometry = new TextGeometry('', {
            font: this.font,
            size: 0.2,
            height: 0.5,
            curveSegments: 3,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 2
        })
        
        this.textMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.3,
            roughness: 0.4,
            emissive: 0xff0000,
            emissiveIntensity: 0.2
        })
    }

    if (this.textMesh) {
        this.scene.remove(this.textMesh)
    }

    this.textGeometry = new TextGeometry(this.updateCountdownText(), {
        font: this.font,
        size: 0.2,
        height: 0.2, 
        curveSegments: 2
    })
    
    this.textGeometry.center()
    this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial)
    this.textMesh.position.set(0, 0, -8)
    this.scene.add(this.textMesh)
  }

  updateText() {
      if (!this.textMesh) return
      
      this.scene.remove(this.textMesh)
      this.createText()
      this.textMesh.quaternion.copy(this.camera.quaternion)
  }

  hideOverlay() {
      const overlay = document.querySelector('.canvas-overlay');
      if (overlay) {
          overlay.classList.add('hidden');
          setTimeout(() => {
              overlay.style.display = 'none';
          }, 1000);

      }
  }

  startAnimation() {
    // Make text a child of camera and set its position
    if (this.textMesh) {
      this.camera.add(this.textMesh);
      this.textMesh.position.set(0, 0, -8);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      // Calculate delta time once
      const delta = this.clock.getDelta();

      // Update mixers once
      if (this.mixer) {
        this.mixer.update(delta);
      }
      if (this.mixer2) {
        this.mixer2.update(delta);
      }

      const currentTime = this.clock.getElapsedTime();
      
      if (this.tree) {
        this.tree.traverse((child) => {
          if (child.isMesh && child.name.includes('lights')) {
            child.material.emissive.setHSL((Math.sin(currentTime) * 10) / 2, 1, 0.5);
          }
        });
      }

      // controls
      this.controls.update();

      // Update text content every second
      if (currentTime - this.lastUpdate >= 1) {
        const newText = this.updateCountdownText();
        if (this.textMesh) {
          this.textMesh.geometry.dispose();
          this.textMesh.geometry = new TextGeometry(newText, {
            font: this.font,
            size: 0.2,
            height: 0.2, 
            curveSegments: 2,
          });
          this.textMesh.geometry.center();
        }
        this.lastUpdate = currentTime;
      }

      // Render scene
      this.renderer.render(this.scene, this.camera);

      // Hide overlay after first successful render
      if (!this.firstRenderComplete) {
        this.firstRenderComplete = true;
        this.hideOverlay();
      }
    };

    animate();
  }
}

// Initialize the scene
new ChristmasScene()