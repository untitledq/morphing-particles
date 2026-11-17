import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import particlesVertexShader from '../../shaders/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/particles/fragment.glsl'

export default class Particles
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.index = 0

        this.setPositions()
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
        this.setDebug()
    }

    setPositions()
    {
        // Positions
        const positions = this.resources.items.particleModels.scene.children.map((child) => {
            return child.geometry.attributes.position
        })

        this.maxCount = 0

        for(const position of positions){
            if(position.count > this.maxCount){
                this.maxCount = position.count
            }
        }

        this.positions = []

        for(const position of positions){
            const originalArray = position.array
            const newArray = new Float32Array(this.maxCount * 3)

            for(let i = 0; i < this.maxCount; i++){
                const i3 = i*3

                if(i3 < originalArray.length){
                    newArray[i3 + 0] = originalArray[i3 + 0]
                    newArray[i3 + 1] = originalArray[i3 + 1]
                    newArray[i3 + 2] = originalArray[i3 + 2]
                }
                else{
                    const randomIndex = Math.floor(position.count * Math.random()) * 3
                    newArray[i3 + 0] = originalArray[randomIndex + 0]
                    newArray[i3 + 1] = originalArray[randomIndex + 1]
                    newArray[i3 + 2] = originalArray[randomIndex + 2]
                }
            }

            this.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
        }
    }

    setGeometry()
    {
        // Geometry
        const sizesArray = new Float32Array(this.maxCount)

        for(let i = 0; i < this.maxCount; i++){
            sizesArray[i] = Math.random()
        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', this.positions[this.index])
        this.geometry.setAttribute('aPositionTarget', this.positions[3])
        this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))
    }

    setMaterial()
    {
        // Material
        this.colorA = '#c64600'
        this.colorB = '#f9f06b'
        this.material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms:
            {
                uSize: new THREE.Uniform(0.4),
                uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio)),
                uProgress: new THREE.Uniform(0),
                uColorA: new THREE.Uniform(new THREE.Color(this.colorA)),
                uColorB: new THREE.Uniform(new THREE.Color(this.colorB)),
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
    }

    setPoints()
    {
        // Points
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.frustumCulled = false
        this.scene.add(this.points)
    }

    morph(index)
    {
        this.geometry.attributes.position = this.positions[this.index]
        this.geometry.attributes.aPositionTarget = this.positions[index]

        // Animate uProgress
        gsap.fromTo(
            this.material.uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: 3, ease: 'linear'}
        )

        // Save Index
        this.index = index
    }

    setDebug()
    {
        // Tweaks
        this.debug.ui.addColor(this, 'colorA').onChange(() => { this.material.uniforms.uColorA.value.set(this.colorA) })
        this.debug.ui.addColor(this, 'colorB').onChange(() => { this.material.uniforms.uColorB.value.set(this.colorB) })
        this.debug.ui.add(this.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001).name('uProgress').listen()
        this.positions.forEach((position, index) => {
            const name = `morph${index}`
            this[name] = () => this.morph(index)
            this.debug.ui.add(this, name)
        })
    }

    resize()
    {
        this.material.uniforms.uResolution.value.set(
            this.sizes.width * this.sizes.pixelRatio,
            this.sizes.height * this.sizes.pixelRatio
        )
    }

    destroy()
    {
        gsap.killTweensOf(this.material.uniforms.uProgress)
        this.scene.remove(this.points)
        this.geometry.dispose()
        this.material.dispose()
    }
}
