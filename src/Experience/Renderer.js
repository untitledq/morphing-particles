import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.instance = new THREE.WebGLRenderer({ canvas: this.experience.canvas, antialias: true })
        this.clearColor = '#160920'
        this.instance.setClearColor(this.clearColor)
        this.experience.debug.ui.addColor(this, 'clearColor').onChange(() => {
            this.instance.setClearColor(this.clearColor)
        })
        this.resize()
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.experience.scene, this.experience.camera.instance)
    }
}
