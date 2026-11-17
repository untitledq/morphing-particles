import Experience from '../Experience.js'
import Particles from './Particles.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.resources.on('ready', () => {
            this.particles = new Particles()
        })
    }

    resize()
    {
        this.particles?.resize()
    }

    destroy()
    {
        this.resources.off('ready')
        this.particles?.destroy()
    }
}
