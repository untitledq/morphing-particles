import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()
        this.sources = sources
        this.items = {}
        this.destroyed = false
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
    }

    async startLoading()
    {
        try
        {
            await Promise.all(this.sources.map(async (source) => {
                if(source.type !== 'gltfModel') throw new Error(`Unsupported resource type: ${source.type}`)
                const model = await this.gltfLoader.loadAsync(source.path)
                if(this.destroyed)
                {
                    this.disposeModel(model)
                    return
                }
                this.items[source.name] = model
            }))
        }
        catch(error)
        {
            if(!this.destroyed) console.error('Could not load scene resources:', error)
            return
        }
        if(!this.destroyed) this.trigger('ready')
    }

    disposeModel(model)
    {
        model.scene.traverse((child) => {
            child.geometry?.dispose()
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            for(const material of materials)
            {
                if(!material) continue
                for(const value of Object.values(material))
                {
                    if(value?.isTexture) value.dispose()
                }
                material.dispose()
            }
        })
    }

    destroy()
    {
        this.destroyed = true
        this.off('ready')
        this.dracoLoader.dispose()
        Object.values(this.items).forEach((model) => this.disposeModel(model))
        this.items = {}
    }
}
