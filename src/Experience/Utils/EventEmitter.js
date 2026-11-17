export default class EventEmitter
{
    constructor()
    {
        this.callbacks = new Map()
    }

    on(name, callback)
    {
        if(!this.callbacks.has(name)) this.callbacks.set(name, new Set())
        this.callbacks.get(name).add(callback)
    }

    off(name)
    {
        this.callbacks.delete(name)
    }

    trigger(name, ...args)
    {
        this.callbacks.get(name)?.forEach((callback) => callback(...args))
    }
}
