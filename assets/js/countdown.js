import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.module.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.119.1/examples/jsm/controls/OrbitControls.js'

class ChristmasScene {
    constructor() {
        this.clock = new THREE.Clock()
        this.lastUpdate = 0
        this.updateInterval = 1000 // Update text every second
        this.scene = new THREE.Scene()
        this.setupCanvas()
        this.setupCamera()
        this.setupRenderer()
        this.setupLights()
        this.setupFog()
        this.setupResizeHandler()
        this.loadAssets()
        this.firstRenderComplete = false;
        this.setupInteraction()
        this.isDragging = false;
        this.previousMouseX = 0;
        this.rotationSpeed = 0;
        this.autoRotate = true;
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
        this.camera.position.set(0, 4, 40)
        this.scene.add(this.camera)
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setClearColor('#ffffff', 0)
    }

    setupLights() {
      // Ambient light for overall scene brightness
      const ambientLight = new THREE.AmbientLight(0x90d5ff, 0.5)
      this.scene.add(ambientLight)

      // Main directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
      directionalLight.position.set(5, 10, 5)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      this.scene.add(directionalLight)

      // Warm point light for tavern glow
      const pointLight1 = new THREE.PointLight(0xffa95c, 1, 20)
      pointLight1.position.set(-2, 3, -8)
      this.scene.add(pointLight1)

      // Cool fill light
      const pointLight2 = new THREE.PointLight(0x4b6cff, 0.5, 20)
      pointLight2.position.set(2, 3, -12)
      this.scene.add(pointLight2)
  }

    setupFog() {
        this.scene.fog = new THREE.Fog('#ffffff', 20, 100)
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

      gltfLoader.load('./assets/models/tavern_in_snow.glb', 
          (gltf) => {
              this.model = gltf.scene
              this.model.position.set(0, -2, -8)
              this.model.scale.set(0.01, 0.01, 0.01)
              this.model.rotation.y = -(Math.PI / 4)
              
              // Enable shadow casting for all meshes
              this.model.traverse((child) => {
                  if (child.isMesh) {
                      child.castShadow = true
                      child.receiveShadow = true
                  }
              })
              
              this.scene.add(this.model)
          },
          (progress) => {
              console.log(`Model ${(progress.loaded / progress.total * 100)}% loaded`);
          },
          (error) => {
              console.error('Error loading model:', error);
          }
      )
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
                size: 1,
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
            size: 1,
            height: 0.5,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
        })
        
        this.textGeometry.center()
        this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial)
        this.textMesh.position.set(0, 4, 10)
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

    setupInteraction() {
        // Setup orbit controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.maxDistance = 50
        this.controls.minDistance = 20
        this.controls.maxPolarAngle = Math.PI / 2
        
        // Setup raycaster
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        
        // Add event listeners
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event))
        this.canvas.addEventListener('click', (event) => this.onMouseClick(event))

        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMouseX = e.clientX;
            this.autoRotate = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.model) {
                const deltaX = e.clientX - this.previousMouseX;
                this.model.rotation.y += deltaX * 0.005;
                this.rotationSpeed = deltaX * 0.005;
                this.previousMouseX = e.clientX;
            }
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            setTimeout(() => {
                this.autoRotate = true;
            }, 1000);
        });
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1
        
        this.raycaster.setFromCamera(this.mouse, this.camera)
        
        if (this.model) {
            const intersects = this.raycaster.intersectObject(this.model, true)
            this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default'
        }
    }

    startAnimation() {
        // Make text a child of camera and set its position
        if (this.textMesh) {
            this.camera.add(this.textMesh);
            this.textMesh.position.set(0, 0, -15);
        }

        const animate = () => {
            requestAnimationFrame(animate);
            
            const currentTime = this.clock.getElapsedTime();
            
            // Update model rotation
            if (this.model) {
                if (this.autoRotate) {
                    this.model.rotation.y += 0.0005;
                } else if (!this.isDragging) {
                    this.rotationSpeed *= 0.95;
                    this.model.rotation.y += this.rotationSpeed;
                }
            }
            
            // Only update text content
            if (currentTime - this.lastUpdate >= 1) {
                const newText = this.updateCountdownText();
                if (this.textMesh) {
                    this.textMesh.geometry.dispose();
                    this.textMesh.geometry = new TextGeometry(newText, {
                        font: this.font,
                        size: 0.5,
                        height: 0.5,
                        curveSegments: 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.05,
                        bevelOffset: 0,
                        bevelSegments: 3
                    });
                    this.textMesh.geometry.center();
                }
                this.lastUpdate = currentTime;
            }
            
            this.renderer.render(this.scene, this.camera);
    
            if (!this.firstRenderComplete) {
                this.firstRenderComplete = true;
                setTimeout(() => this.hideOverlay(), 2000);
            }
        }
        
        animate();
    }
}

// Initialize the scene
new ChristmasScene()